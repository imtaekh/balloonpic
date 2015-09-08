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
      } else {
        vm.leftPanel="igNew";
        document.querySelector('ig-show').className="hidden";
        document.querySelector('ig-new').className="";
        document.querySelector('#map').className="map_active";
        document.querySelector('#side').className="side_active";
        vm.igIndex();
      }
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
    var mapInit = function () {
      var mapOptions = {
                    zoom: 12,
                    center: new google.maps.LatLng(centerLatLng.lat,centerLatLng.lng)
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
