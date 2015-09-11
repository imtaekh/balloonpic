(function() {
  'use strict';
  angular.module("MapController",[])
    .controller("MapController",MapController);

  MapController.$inject=["$scope","$http","$window","Auth"];

  function MapController($scope,$http,$window,Auth){
    var vm = this;
    vm.leftPanel="";
    vm.myIgPics =[];
    vm.igPic ={};
    vm.socket = io();

    vm.closeLeftPanel=function () {
      vm.leftPanel="";
      document.querySelector('#map').className="map_inactive";
      document.querySelector('#side').className="side_inactive";
      setTimeout(function () {
        google.maps.event.trigger(map, "resize");
      },1000);
      if(vm.finalDestination.marker){
        vm.finalDestination.marker.setMap(null);
      }
    };

    vm.formatDate=function (date) {
      var month =["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      return ((date.getHours().toString().length==1)?("0"+date.getHours()):(date.getHours()))+":"+
                ((date.getMinutes().toString().length==1)?("0"+date.getMinutes()):(date.getMinutes()))+" "+
                month[date.getMonth()]+" "+
                ((date.getDate().toString().length==1)?("0"+date.getDate()):(date.getDate()))+", "+
                date.getFullYear();
    };

    vm.formatDuration=function (milisec) {
      var seconds = parseInt(milisec/1000);

      var days = 0;
      var hours = 0;
      var mins = 0;
      var result = "";
      if (seconds > 60*60*24){
        days = parseInt(seconds/(60*60*24));
        seconds -= (60*60*24)*days;
        result += days+" days ";
      }
      if (seconds > 60*60){
        hours = parseInt(seconds/(60*60));
        seconds -= (60*60)*hours;
        result += hours+" hours ";
      }
      if (seconds > 60) {
        mins = parseInt(seconds/60);
        seconds -= 60*mins;
        result += mins+" mins ";
      }
      result += seconds+" secs";
      return result;
    };

    vm.igShowIsRunning=false;
    vm.igShowDetailToggle=function () {
      if(vm.igPic.detailClass=="detail_inactive"){
        vm.igPic.detailClass="detail_active";
        vm.igPic.detailBtnClass="hidden";
      } else {
        vm.igPic.detailClass="detail_inactive";
        vm.igPic.detailBtnClass="btn btn-default btn-detail";
      }
    };
    vm.igShow = function(marker){
      if(vm.igShowIsRunning) return;
      vm.igShowIsRunning=true;
      vm.igPic.balloon=marker;

      var now = Date.now();
      vm.igPic.created_at=vm.formatDate(new Date(vm.igPic.balloon.data.created_at));
      vm.igPic.arrived_at=vm.formatDate(new Date(vm.igPic.balloon.data.arrived_at));
      if(marker.data.arrived_at > now){
        vm.igPic.status="Flying to";
        vm.igPic.arrived=false;
        vm.igPic.travelTime=vm.formatDuration(now-vm.igPic.balloon.data.created_at);
      } else {
        vm.igPic.status="Arrived at";
        vm.igPic.arrived=true;
        vm.igPic.travelTime=vm.formatDuration(vm.igPic.balloon.data.arrived_at-vm.igPic.balloon.data.created_at);
      }
      vm.igPic.detailClass="detail_inactive";
      vm.igPic.detailBtnClass="btn btn-default btn-detail";

      $http.get("api/show_ig",{
        params:{
          igid:marker.igId
        }
      }).success(function (data) {
        if(data.success){
          vm.igPic.ig = data.data;
          if(vm.leftPanel==vm.igPic.ig.id){
            vm.closeLeftPanel();
          } else if(vm.leftPanel=="igNew"){
            vm.leftPanel=vm.igPic.igId;
            document.querySelector('ig-show').className="";
            document.querySelector('ig-new').className="hidden";
          } else {
            vm.leftPanel=vm.igPic.ig.id;
            document.querySelector('ig-show').className="";
            document.querySelector('ig-new').className="hidden";
            document.querySelector('#map').className="map_active";
            document.querySelector('#side').className="side_active";
          }
          vm.igShowIsRunning=false;
        } else {
          alert("Something went Wrong, please login again..");
          Auth.logout();
        }
      }).error(function (error) {
        alert("Something went Wrong, please login again..", error);
        Auth.logout();
      });
    };

    vm.igIndex = function () {
      $http.get("api/my_ig").success(function (data) {
        if(data.success){
          vm.myIgPics = data.data;
          // console.log(data.data);
        } else {
          alert("Something went Wrong, please login again..");
          Auth.logout();
        }
      }).error(function (error) {
        alert("Something went Wrong, please login again..", error);
        Auth.logout();
      });
    };

    vm.igNew = function(){
      if(vm.leftPanel=="igNew"){
        vm.closeLeftPanel();
      } else if(vm.leftPanel){
        vm.leftPanel="igNew";
        document.querySelector('ig-show').className="hidden";
        document.querySelector('ig-new').className="";
        vm.igIndex();
        vm.startOver();
      } else {
        vm.leftPanel="igNew";
        document.querySelector('ig-show').className="hidden";
        document.querySelector('ig-new').className="";
        document.querySelector('#map').className="map_active";
        document.querySelector('#side').className="side_active";
        vm.igIndex();
        vm.startOver();
      }
    };

    vm.unSelectPic = function () {
      vm.igNewPic = undefined;
      var hiddenPics = document.querySelectorAll(".my_ig_pic_con_hidden");
      for (var i = 0; i < hiddenPics.length; i++) {
        hiddenPics[i].className="col-xs-4 my_ig_pic_con";
      }
      var selected=document.querySelector(".my_ig_pic_con_selected");
      if(selected) selected.className="col-xs-4 my_ig_pic_con";
    };

    vm.startOver = function () {
      vm.unSelectPic();
      vm.locationAddress = "";
      vm.locationAddressSearchResults = "";
      vm.selectedAddress = {};
      vm.placeName = "";
      vm.placeNameSearchResults= "";
      vm.selectedPlaceName = {};
      if(vm.finalDestination.marker){
        vm.finalDestination.marker.setMap(null);
      }
      vm.finalDestination={};
      vm.igShowDone=false;
    };

    vm.igNewPic = undefined;
    vm.selectPic = function (id) {
      if (vm.igNewPic) {
        vm.unSelectPic();
      } else {
        var pic=document.getElementById(id);
        vm.igNewPic = {id:id,image:pic.dataset.image,link:pic.dataset.link};
        var myIgPics = document.querySelectorAll(".my_ig_pic_con");
        for (var i = 0; i < myIgPics.length; i++) {
          myIgPics[i].className="my_ig_pic_con_hidden";
        }
        pic.className="my_ig_pic_con_selected";
        vm.igShowSelectedPic=id;
      }
    };

    vm.finalDestination={};
    vm.locationAddress = "";
    vm.locationAddressSearchResults = "";
    vm.findByAddress = function () {
      $http.get("api/find_location_by_address",{
        params:{
          address:vm.locationAddress
        }
      }).success(function (data) {
        if(data.success){
          vm.locationAddressSearchResults=data.data;
          // console.log(data.data);
        } else {
          alert("Something went Wrong, please login again..");
          Auth.logout();
        }
      }).error(function (error) {
        alert("Something went Wrong, please login again..", error);
        Auth.logout();
      });
    };

    vm.generateDestinationMarker = function (title,address) {
      var content="<h4>"+title+"</h4>";
      if(address){
        content+="<h5>"+address+"</h5>";
      }
      vm.finalDestination.infowindow = new google.maps.InfoWindow({
        content: content
      });
      if(vm.finalDestination.marker){
        vm.finalDestination.marker.setMap(null);
      }
      vm.finalDestination.marker = new google.maps.Marker({
                                      position: new google.maps.LatLng(vm.finalDestination.lat, vm.finalDestination.lng),
                                      title: title
                                    });
      vm.finalDestination.marker.setMap(vm.map);
      vm.finalDestination.infowindow.open(vm.map, vm.finalDestination.marker);
    };

    vm.selectedAddress = {};
    vm.selectAddress = function () {
      vm.finalDestination.lat=vm.selectedAddress.geometry.location.lat;
      vm.finalDestination.lng=vm.selectedAddress.geometry.location.lng;
      vm.generateDestinationMarker(vm.selectedAddress.formatted_address);

      //address triming//
      vm.selectedAddress.address_components.forEach(function (component) {
        var pass = false;
        component.types.forEach(function (type) {
          if(type=="political"){
            pass = true;
          }
        });
        if(!pass){
          var add = vm.selectedAddress.formatted_address ;
          add = add.replace(component.long_name,"");
          add = add.replace(component.short_name,"");
          vm.selectedAddress.formatted_address = add;
        }
      });
      vm.selectedAddress.formatted_address = vm.selectedAddress.formatted_address.split(",").map(function(el){return el.trim();}).filter(function(el){ return el!=="";}).join(", ");
      vm.finalDestination.name = vm.selectedAddress.formatted_address;
      /////////////////

      google.maps.event.trigger(map, "resize");
      vm.map.setCenter(new google.maps.LatLng(vm.finalDestination.lat,vm.finalDestination.lng));
      vm.map.setZoom(14);
    };

    vm.placeName = "";
    vm.placeNameSearchResults= "";
    vm.findByPlaceName=function () {
      $http.get("api/find_location_by_place_name",{
        params:{
          lat:vm.selectedAddress.geometry.location.lat,
          lng:vm.selectedAddress.geometry.location.lng,
          placename: vm.placeName
        }
      }).success(function (data) {
        if(data.success){
          vm.placeNameSearchResults=data.data.results;
          // console.log(vm.placeNameSearchResults);
        } else {
          alert("Something went Wrong, please login again..");
          Auth.logout();
        }
      }).error(function (error) {
        alert("Something went Wrong, please login again..", error);
        Auth.logout();
      });
    };
    vm.selectedPlaceName ={};
    vm.selectPlaceName = function () {
      if(vm.selectedPlaceName){
        vm.finalDestination.lat=vm.selectedPlaceName.geometry.location.lat;
        vm.finalDestination.lng=vm.selectedPlaceName.geometry.location.lng;
        vm.finalDestination.name=vm.selectedPlaceName.name;

        google.maps.event.trigger(map, "resize");
        vm.generateDestinationMarker(vm.selectedPlaceName.name, vm.selectedPlaceName.vicinity);
        vm.map.setCenter(new google.maps.LatLng(vm.finalDestination.lat,vm.finalDestination.lng));
        vm.map.setZoom(16);
      }
    };

    vm.igShowDone=false;
    vm.confirm=function () {
      vm.finalDestination.marker.setMap(null);
      var latDif = vm.finalDestination.lat-vm.centerLatLng.lat;
      var lngDif = vm.finalDestination.lng-vm.centerLatLng.lng;
      var rad = (lngDif >= 0)?Math.atan(latDif/lngDif):Math.PI+Math.atan(latDif/lngDif);
      var latVel=Math.sin(rad);
      var lngVel=Math.cos(rad);
      var created_at=Date.now();
      var arrived_at=parseInt(created_at+Math.abs(latDif/latVel*40000*1000));

      var Balloon = {
        name: vm.finalDestination.name,
        igId: vm.igNewPic.id,
        igImage: vm.igNewPic.image,
        igLink: vm.igNewPic.link,
        lat: vm.centerLatLng.lat,
        lng: vm.centerLatLng.lng,
        endLat: vm.finalDestination.lat,
        endLng: vm.finalDestination.lng,
        latVel: latVel,
        lngVel: lngVel,
        created_at: created_at,
        arrived_at: arrived_at
      };
      window.navigator.geolocation.getCurrentPosition(
        function (position) {
          vm.centerLatLng.lat = position.coords.latitude;
          vm.centerLatLng.lng = position.coords.longitude;
          $http.post("api/balloons",Balloon)
          .success(function (data) {
            if(data.success){
              console.log("sending balloon", data.data);
              vm.socket.emit('newBalloon', data.data);
              // vm.balloons.push(data.data);
              // vm.generateMarker(vm.balloons[vm.balloons.length-1]);
              vm.map.setCenter(new google.maps.LatLng(data.data.lat,data.data.lng));
              vm.map.setZoom(12);
              vm.igShowDone=true;
            } else {
              alert("Something went Wrong, please login again..");
              Auth.logout();
            }
          }).error(function (error) {
            alert("Something went Wrong, please login again..", error);
            Auth.logout();
          });
        },function (err) {
        }
      );
    };

    vm.socket.on('newBalloon', function (balloon) {
      vm.balloons.push(balloon);
      vm.generateMarker(vm.balloons[vm.balloons.length-1]);
    });

    vm.generateMarker=function (balloon,now) {
      if(now < balloon.arrived_at){
        balloon.curLat = balloon.lat + (balloon.endLat - balloon.lat) * (now - balloon.created_at)/(balloon.arrived_at - balloon.created_at);
        balloon.curLng = balloon.lng + (balloon.endLng - balloon.lng) * (now - balloon.created_at)/(balloon.arrived_at - balloon.created_at);
      } else {
        balloon.curLat = balloon.endLat;
        balloon.curLng = balloon.endLng;
      }
      var newMarker = new google.maps.Marker({
                          position: new google.maps.LatLng(balloon.curLat, balloon.curLng),
                          title: balloon.name,
                          igId: balloon.igId,
                          icon: new google.maps.MarkerImage(
                                  balloon.igImage,
                                  null, /* size is determined at runtime */
                                  null, /* origin is 0,0 */
                                  null, /* anchor is bottom center of the scaled image */
                                  new google.maps.Size(50, 50)
                                )
                      });
      vm.oms.addListener('click', function(newMarker, event) {
        vm.igShow(newMarker);
      });
      vm.oms.addListener('spiderfy', function(newMarker, event) {
        vm.balloons.forEach(function (eachBalloon) {
          newMarker.forEach(function (marker) {
            if(eachBalloon.igId==marker.igId){
              eachBalloon.stop=true;
            }
          });
        });
      });
      vm.oms.addListener('unspiderfy', function(newMarker, event) {
        vm.balloons.forEach(function (eachBalloon) {
          newMarker.forEach(function (marker) {
            if(eachBalloon.igId==marker.igId){
              eachBalloon.stop=false;
            }
          });
        });
      });
      vm.oms.addMarker(newMarker);
      balloon.marker = newMarker;
      balloon.marker.data = balloon;
      balloon.marker.setMap(vm.map);
    };

    vm.balloons=[];

    vm.centerLatLng = {lat:34.05223,lng:-118.24368};
    document.querySelector('ig-show').className="hidden";
    document.querySelector('ig-new').className="hidden";
    var mapInit = function (lat,lng,zoom) {
      var customMapType = new google.maps.StyledMapType([{"featureType":"landscape","stylers":[{"hue":"#FFBB00"},{"saturation":43.400000000000006},{"lightness":37.599999999999994},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#FFC200"},{"saturation":-61.8},{"lightness":45.599999999999994},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":51.19999999999999},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":52},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#0078FF"},{"saturation":-13.200000000000003},{"lightness":2.4000000000000057},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#00FF6A"},{"saturation":-1.0989010989011234},{"lightness":11.200000000000017},{"gamma":1}]}],{
        name: 'map_style'
      });
      var mapOptions = {
                    zoom: zoom,
                    center: new google.maps.LatLng(lat,lng),
                    disableDefaultUI: true,
                    mapTypeControlOptions: {
                     mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
                   }
                };
      vm.map = new google.maps.Map(document.getElementById('map'), mapOptions);
      vm.map.mapTypes.set('map_style', customMapType);
      vm.map.setMapTypeId('map_style');
      vm.oms = new OverlappingMarkerSpiderfier(vm.map, {circleFootSeparation: 46, spiralFootSeparation: 52});

      var now = Date.now();
      vm.balloons.forEach(function (balloon) {
        vm.generateMarker(balloon, now);
      });

      vm.updateBalloons = setInterval( function(){
        var now = Date.now();

        if(vm.igPic.arrived===false){
          vm.igPic.travelTime=vm.formatDuration(now-vm.igPic.balloon.data.created_at);
          // console.log(vm.igPic.travelTime);
          document.querySelector("#liveTravelingTime").innerText=vm.igPic.travelTime;
        }

        vm.balloons.forEach(function (balloon) {
          if(!balloon.stop && now < balloon.arrived_at){
            balloon.curLat = balloon.lat + (balloon.endLat - balloon.lat) * (now - balloon.created_at)/(balloon.arrived_at - balloon.created_at);
            balloon.curLng = balloon.lng + (balloon.endLng - balloon.lng) * (now - balloon.created_at)/(balloon.arrived_at - balloon.created_at);
            balloon.marker.setPosition( new google.maps.LatLng(balloon.curLat, balloon.curLng) );
          }
        });
      }, 1000 );

    };


    $http.get("api/balloons").success(function (data) {
      // console.log(data.data);
      if(data.success){
        vm.balloons = data.data;

      } else {
        alert("Something went Wrong, please login again..");
        Auth.logout();
      }
    }).error(function (error) {
      alert("Something went Wrong, please login again..", error);
      Auth.logout();
    });

    window.navigator.geolocation.getCurrentPosition(
      function (position) {
        vm.centerLatLng.lat = position.coords.latitude;
        vm.centerLatLng.lng = position.coords.longitude;
        mapInit(vm.centerLatLng.lat,vm.centerLatLng.lng,12);
      },function (err) {
      }
    );

    vm.myLocation = function () {
      window.navigator.geolocation.getCurrentPosition(
        function (position) {
          vm.centerLatLng.lat = position.coords.latitude;
          vm.centerLatLng.lng = position.coords.longitude;
          vm.map.setCenter(new google.maps.LatLng(vm.centerLatLng.lat,vm.centerLatLng.lng));
          vm.map.setZoom(12);
        },function (err) {
        }
      );
    };

    $scope.$on("$destroy", function(){
       clearInterval(vm.updateBalloons);
   });
  }
}());
