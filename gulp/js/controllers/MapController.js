(function() {
  'use strict';
  angular.module("MapController",[])
    .controller("MapController",MapController);

  MapController.$inject=["$http","$window","Auth"];

  function MapController($http,$window,Auth){
    var vm = this;
    vm.leftPanel="";
    vm.myIgPics =[];

    vm.igShow = function(){
      if(vm.leftPanel=="igShow"){
        vm.leftPanel="";
        document.querySelector('#map').className="map_inactive";
        document.querySelector('#side').className="side_inactive";
      } else if(vm.leftPanel=="igNew"){
        vm.leftPanel="igShow";
        document.querySelector('ig-show').className="";
        document.querySelector('ig-new').className="hidden";
      } else {
        vm.leftPanel="igShow";
        document.querySelector('ig-show').className="";
        document.querySelector('ig-new').className="hidden";
        document.querySelector('#map').className="map_active";
        document.querySelector('#side').className="side_active";
      }
    };
    vm.igIndex = function () {
      $http.get("api/my_ig").success(function (data) {
        if(data.success){
          vm.myIgPics = data.data;
        } else {
          alert("Something went Wrong, please login again..");
          Auth.logout();
        }
      }).error(function function_name(argument) {
        alert("Something went Wrong, please login again..");
        Auth.logout();
      });
    };
    vm.igNew = function(){
      console.log("IGNEW :",vm.leftPanel);
      if(vm.leftPanel=="igNew"){
        vm.leftPanel="";
        document.querySelector('#map').className="map_inactive";
        document.querySelector('#side').className="side_inactive";
      } else if(vm.leftPanel=="igShow"){
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
      vm.igNewPicId = undefined;
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
      vm.locationAddressId = "";
      vm.locationAddressSearchResults = "";
      vm.selectedAddress = {};
      vm.placeName = "";
      vm.placeNameId = "";
      vm.placeNameSearchResults= "";
      vm.selectedPlaceName = {};
    };
    vm.igNewPicId = undefined;
    vm.selectPic = function (id) {
      if (vm.igNewPicId) {
        vm.unSelectPic();
      } else {
        vm.igNewPicId = id;
        var myIgPics = document.querySelectorAll(".my_ig_pic_con");
        for (var i = 0; i < myIgPics.length; i++) {
          myIgPics[i].className="my_ig_pic_con_hidden";
        }
        document.getElementById(id).className="my_ig_pic_con_selected";
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

          console.log(vm.locationAddressSearchResults);
        } else {
          alert("Something went Wrong, please login again..");
          Auth.logout();
        }
      }).error(function function_name(argument) {
        alert("Something went Wrong, please login again..");
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
          console.log(data.data.results);
        } else {
          alert("Something went Wrong, please login again..");
          Auth.logout();
        }
      }).error(function function_name(argument) {
        alert("Something went Wrong, please login again..");
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
      google.maps.event.trigger(map, "resize");
      vm.map.setCenter(new google.maps.LatLng(vm.finalLatLng.lat,vm.finalLatLng.lng));
      vm.map.setZoom(16);
    };







    vm.markers=[{
      lat:34.052,
      lng:-118.243,
      latVol:-0.00001,
      lngVol:-0.00001,
      imgUrl:"http://www.keenthemes.com/preview/metronic/theme/assets/global/plugins/jcrop/demos/demo_files/image1.jpg"
    },{
      lat:34.062,
      lng:-118.243,
      latVol:0.00001,
      lngVol:-0.00001,
      imgUrl:"http://www.keenthemes.com/preview/metronic/theme/assets/global/plugins/jcrop/demos/demo_files/image1.jpg"
    }];

    var centerLatLng = {lat:34.05223,lng:-118.24368};
    document.getElementById('map').style.height=window.innerHeight-50+"px";
    document.querySelector('ig-show').className="hidden";
    document.querySelector('ig-new').className="hidden";
    var mapInit = function (lat,lng,zoom) {
      var mapOptions = {
                    zoom: zoom,
                    center: new google.maps.LatLng(lat,lng)
                };
      vm.map = new google.maps.Map(document.getElementById('map'), mapOptions);

      vm.markers.forEach(function (marker) {
        marker.marker = new google.maps.Marker({
                            position: new google.maps.LatLng(marker.lat, marker.lng),
                            title: "my marker",
                            icon: new google.maps.MarkerImage(
                                    marker.imgUrl,
                                    null, /* size is determined at runtime */
                                    null, /* origin is 0,0 */
                                    null, /* anchor is bottom center of the scaled image */
                                    new google.maps.Size(60, 60)
                                  )
                        });
        marker.marker.setMap(vm.map);
        google.maps.event.addListener(marker.marker, 'click', vm.igShow);
      });



    setInterval( function(){
      vm.markers.forEach(function (marker) {
        marker.lat+=marker.latVol;
        marker.lng+=marker.lngVol;
        // console.log(marker);
        marker.marker.setPosition( new google.maps.LatLng(marker.lat, marker.lng) );
      });
    }, 100 );

    };
    mapInit(centerLatLng.lat,centerLatLng.lng,12);
    console.dir(vm.map);
    // window.navigator.geolocation.getCurrentPosition(
    //   function (position) {
    //     centerLatLng.lat = position.coords.latitude;
    //     centerLatLng.lng = position.coords.longitude;
    //     console.log(position);
    //     mapInit();
    //   },function (err) {
    //     console.log(err);
    //     mapInit();
    //   }
    // );


  }
}());
