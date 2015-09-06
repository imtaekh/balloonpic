(function() {
  'use strict';
  angular.module("MapController",[])
    .controller("MapController",MapController);

  MapController.$inject=["$rootScope", "$window", "Auth"];

  function MapController($rootScope, $window, Auth){
    var vm = this;

    var centerLatLng ={lat:34.05223,lng:-118.24368}
    window.navigator.geolocation.getCurrentPosition(
      function (position) {
        centerLatLng.lat = position.coords.latitude;
        centerLatLng.lng = position.coords.longitude;
        console.log(position);
        var mapOptions = {
                      zoom: 15,
                      center: new google.maps.LatLng(centerLatLng.lat,centerLatLng.lng)
                  };
        var map = new google.maps.Map(document.getElementById('map'), mapOptions);
      },function (err) {
        console.log(err);
        var mapOptions = {
                      zoom: 15,
                      center: new google.maps.LatLng(centerLatLng.lat,centerLatLng.lng)
                  };
        var map = new google.maps.Map(document.getElementById('map'), mapOptions);
      }
    );
    document.getElementById('map').style.height=window.innerHeight-50+"px";

  }
}());
