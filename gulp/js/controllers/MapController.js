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
    vm.closeLeftPanel=function () {
      vm.leftPanel="";
      document.querySelector('#map').className="map_inactive";
      document.querySelector('#side').className="side_inactive";
      setTimeout(function () {
        google.maps.event.trigger(map, "resize");
      },1000);
    };
    vm.igShowIsRunning=false;
    vm.igShow = function(marker){
      if(vm.igShowIsRunning) return;
      vm.igShowIsRunning=true;
      vm.igPic.balloon=marker;
      $http.get("api/show_ig",{
        params:{
          igid:marker.igId
        }
      }).success(function (data) {
        if(data.success){
          vm.igPic.ig = data.data;
          console.log(vm.igPic);
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
      vm.finalLatLng={};
      vm.locationAddress = "";
      vm.locationAddressSearchResults = "";
      vm.selectedAddressId = "";
      vm.selectedAddress = {};
      vm.placeName = "";
      vm.placeNameSearchResults= "";
      vm.selectedPlaceNameId = "";
      if(vm.selectedPlaceName.marker){
        vm.selectedPlaceName.marker.setMap(null);
      }
      vm.selectedPlaceName = {};
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

    vm.finalLatLng={};


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
          console.log(data.data);
        } else {
          alert("Something went Wrong, please login again..");
          Auth.logout();
        }
      }).error(function (error) {
        alert("Something went Wrong, please login again..", error);
        Auth.logout();
      });
    };
    vm.selectedAddress = {};
    vm.selectAddress = function (id) {
      var address =document.getElementById("address_"+vm.selectedAddressId);
      vm.selectedAddress.name=address.dataset.name;
      vm.selectedAddress.lat=address.dataset.lat;
      vm.selectedAddress.lng=address.dataset.lng;
      vm.finalLatLng.lat=address.dataset.lat;
      vm.finalLatLng.lng=address.dataset.lng;
      google.maps.event.trigger(map, "resize");
      vm.map.setCenter(new google.maps.LatLng(vm.finalLatLng.lat,vm.finalLatLng.lng));
      vm.map.setZoom(14);
    };
    vm.placeName = "";
    vm.placeNameSearchResults= "";
    vm.findByPlaceName=function () {
      $http.get("api/find_location_by_place_name",{
        params:{
          lat:vm.selectedAddress.lat,
          lng:vm.selectedAddress.lng,
          placename: vm.placeName
        }
      }).success(function (data) {
        if(data.success){
          vm.placeNameSearchResults=data.data.results;
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
      var placeName =document.getElementById("place_"+vm.selectedPlaceNameId);
      vm.selectedPlaceName.name=placeName.dataset.name;
      vm.selectedPlaceName.lat=placeName.dataset.lat;
      vm.selectedPlaceName.lng=placeName.dataset.lng;
      vm.finalLatLng.lat=placeName.dataset.lat;
      vm.finalLatLng.lng=placeName.dataset.lng;
      vm.finalLatLng.name=vm.selectedPlaceName.name;



      google.maps.event.trigger(map, "resize");

      vm.selectedPlaceName.infowindow = new google.maps.InfoWindow({
        content: vm.selectedPlaceName.name
      });
      if(vm.selectedPlaceName.marker){
        vm.selectedPlaceName.marker.setMap(null);
      }
      vm.selectedPlaceName.marker = new google.maps.Marker({
                                      position: new google.maps.LatLng(vm.selectedPlaceName.lat, vm.selectedPlaceName.lng),
                                      title: vm.selectedPlaceName.name
                                    });
      vm.selectedPlaceName.marker.setMap(vm.map);
      vm.selectedPlaceName.infowindow.open(vm.map, vm.selectedPlaceName.marker);
      vm.map.setCenter(new google.maps.LatLng(vm.finalLatLng.lat,vm.finalLatLng.lng));
      vm.map.setZoom(16);

    };
    vm.igShowDone=false;
    vm.confirm=function () {
      var latDif = vm.finalLatLng.lat-vm.centerLatLng.lat;
      var lngDif = vm.finalLatLng.lng-vm.centerLatLng.lng;
      var rad = (lngDif >= 0)?Math.atan(latDif/lngDif):Math.PI+Math.atan(latDif/lngDif);
      var latVel=Math.sin(rad);
      var lngVel=Math.cos(rad);
      var created_at=Date.now();
      var arrived_at=parseInt(created_at+Math.abs(latDif/latVel*100000*1000));

      var Balloon = {
        name: vm.finalLatLng.name,
        igId: vm.igNewPic.id,
        igImage: vm.igNewPic.image,
        igLink: vm.igNewPic.link,
        lat: vm.centerLatLng.lat,
        lng: vm.centerLatLng.lng,
        endLat: vm.finalLatLng.lat,
        endLng: vm.finalLatLng.lng,
        latVel: latVel,
        lngVel: lngVel,
        created_at: created_at,
        arrived_at: arrived_at
      };

      $http.post("api/balloons",Balloon)
      .success(function (data) {
        if(data.success){
          console.log(data.data);
          vm.balloons.push(data.data);
          vm.generateMarker(vm.balloons[vm.balloons.length-1]);

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
    };

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
      console.log(data.data);
      if(data.success){
        vm.balloons = data.data;
        mapInit(vm.centerLatLng.lat,vm.centerLatLng.lng,12);
      } else {
        alert("Something went Wrong, please login again..");
        Auth.logout();
      }
    }).error(function (error) {
      alert("Something went Wrong, please login again..", error);
      Auth.logout();
    });

    // window.navigator.geolocation.getCurrentPosition(
    //   function (position) {
    //     vm.centerLatLng.lat = position.coords.latitude;
    //     vm.centerLatLng.lng = position.coords.longitude;
    //     console.log(position);
    //     mapInit();
    //   },function (err) {
    //     console.log(err);
    //     mapInit();
    //   }
    // );

    $scope.$on("$destroy", function(){
       clearInterval(vm.updateBalloons);
   });
  }
}());
