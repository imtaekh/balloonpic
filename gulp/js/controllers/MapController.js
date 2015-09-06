(function() {
  'use strict';
  angular.module("MapController",[])
    .controller("MapController",MapController);

  MapController.$inject=["$rootScope", "$window", "Auth"];

  function MapController($rootScope, $window, Auth){
    var vm = this;

    vm.markerData={
      lat:34.052,
      lng:-118.243,
      imgUrl:"http://www.keenthemes.com/preview/metronic/theme/assets/global/plugins/jcrop/demos/demo_files/image1.jpg"
    };

    var centerLatLng = {lat:34.05223,lng:-118.24368};
    document.getElementById('map').style.height=window.innerHeight-50+"px";
    var mapInit = function () {
      var mapOptions = {
                    zoom: 15,
                    center: new google.maps.LatLng(centerLatLng.lat,centerLatLng.lng)
                };
      vm.map = new google.maps.Map(document.getElementById('map'), mapOptions);

      vm.marker = new google.maps.Marker({
                          // map: vm.map,
                          position: new google.maps.LatLng(vm.markerData.lat, vm.markerData.lng),
                          title: "my marker",
                          icon: new google.maps.MarkerImage(
                                  vm.markerData.imgUrl,
                                  null, /* size is determined at runtime */
                                  null, /* origin is 0,0 */
                                  null, /* anchor is bottom center of the scaled image */
                                  new google.maps.Size(70, 70)
                                )
                      })
      vm.marker.setMap(vm.map);
      google.maps.event.addListener(vm.marker, 'click', function(){
                      console.log("clicked");
                  });
      setInterval( function(){
        vm.markerData.lat-=0.00001;
        vm.markerData.lng-=0.00001;
        // console.log(vm.markerData);
        vm.marker.setPosition( new google.maps.LatLng(vm.markerData.lat, vm.markerData.lng) );

    }, 60 );

    };
    mapInit();
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
