!function(){"use strict";function e(e,t){var a={};return a}angular.module("AppService",["ngRoute"]).factory("AppService",e),e.$inject=["$location","$window"]}(),function(){"use strict";function e(e,t,a,n){var o={};return o.logout=function(){n.setToken(),a.path("/")},o.isLoggedIn=function(){return n.getToken()?!0:!1},o.getUser=function(){return n.getToken()?e.get("/api/me"):t.reject({message:"User has no token"})},o}function t(e){var t={};return t.getToken=function(){return e.get("token")},t.setToken=function(t){t?e.put("token",t):e.remove("token")},t}function a(e,t,a){var n={};return n.request=function(e){var t=a.getToken();return t&&(e.headers["x-access-token"]=t),e},n.responseError=function(n){return 403==n.status&&(a.setToken(),t.path("/")),e.reject(n)},n}angular.module("AuthService",[]).factory("Auth",e).factory("AuthToken",t).factory("AuthInterceptor",a),e.$inject=["$http","$q","$location","AuthToken"],t.$inject=["$cookies"],a.$inject=["$q","$location","AuthToken"]}(),function(){"use strict";function e(e,t,a){var n=this;n.initialize=function(){a.getUser().then(function(e){e.data.success?n.user=e.data.data:delete n.user,n.isLoggedIn=n.user?!0:!1,console.log("USER : ",n.user)})},n.initialize(),e.$on("$routeChangeStart",n.initialize),n.login=function(){t.location.href="/auth/instagram"},n.logout=function(){console.log("logout"),a.logout(),delete n.user},n.menuStyle="collapse navbar-collapse",n.menuClick=function(){"navbar-collapse"==n.menuStyle?n.menuStyle="collapse navbar-collapse":n.menuStyle="navbar-collapse"}}angular.module("AppController",[]).controller("AppController",e),e.$inject=["$rootScope","$window","Auth"]}(),function(){"use strict";function e(e,t,a,n){var o=this;o.leftPanel="",o.myIgPics=[],o.igPic={},o.closeLeftPanel=function(){o.leftPanel="",document.querySelector("#map").className="map_inactive",document.querySelector("#side").className="side_inactive",setTimeout(function(){google.maps.event.trigger(map,"resize")},1e3)},o.igShowIsRunning=!1,o.igShow=function(e){o.igShowIsRunning||(o.igShowIsRunning=!0,o.igPic.balloon=e,t.get("api/show_ig",{params:{igid:e.igId}}).success(function(e){e.success?(o.igPic.ig=e.data,console.log(o.igPic),o.leftPanel==o.igPic.ig.id?o.closeLeftPanel():"igNew"==o.leftPanel?(o.leftPanel=o.igPic.igId,document.querySelector("ig-show").className="",document.querySelector("ig-new").className="hidden"):(o.leftPanel=o.igPic.ig.id,document.querySelector("ig-show").className="",document.querySelector("ig-new").className="hidden",document.querySelector("#map").className="map_active",document.querySelector("#side").className="side_active"),o.igShowIsRunning=!1):(alert("Something went Wrong, please login again.."),n.logout())}).error(function(e){alert("Something went Wrong, please login again..",e),n.logout()}))},o.igIndex=function(){t.get("api/my_ig").success(function(e){e.success?o.myIgPics=e.data:(alert("Something went Wrong, please login again.."),n.logout())}).error(function(e){alert("Something went Wrong, please login again..",e),n.logout()})},o.igNew=function(){"igNew"==o.leftPanel?o.closeLeftPanel():o.leftPanel?(o.leftPanel="igNew",document.querySelector("ig-show").className="hidden",document.querySelector("ig-new").className="",o.igIndex(),o.startOver()):(o.leftPanel="igNew",document.querySelector("ig-show").className="hidden",document.querySelector("ig-new").className="",document.querySelector("#map").className="map_active",document.querySelector("#side").className="side_active",o.igIndex(),o.startOver())},o.unSelectPic=function(){o.igNewPic=void 0;for(var e=document.querySelectorAll(".my_ig_pic_con_hidden"),t=0;t<e.length;t++)e[t].className="col-xs-4 my_ig_pic_con";var a=document.querySelector(".my_ig_pic_con_selected");a&&(a.className="col-xs-4 my_ig_pic_con")},o.startOver=function(){o.unSelectPic(),o.finalLatLng={},o.locationAddress="",o.locationAddressSearchResults="",o.selectedAddress={},o.placeName="",o.placeNameSearchResults="",o.selectedPlaceName={},o.selectedPlaceName.marker&&o.selectedPlaceName.marker.setMap(null),o.igShowDone=!1},o.igNewPic=void 0,o.selectPic=function(e){if(o.igNewPic)o.unSelectPic();else{var t=document.getElementById(e);o.igNewPic={id:e,image:t.dataset.image,link:t.dataset.link};for(var a=document.querySelectorAll(".my_ig_pic_con"),n=0;n<a.length;n++)a[n].className="my_ig_pic_con_hidden";t.className="my_ig_pic_con_selected",o.igShowSelectedPic=e}},o.finalLatLng={},o.locationAddress="",o.locationAddressSearchResults="",o.findByAddress=function(){t.get("api/find_location_by_address",{params:{address:o.locationAddress}}).success(function(e){e.success?o.locationAddressSearchResults=e.data:(alert("Something went Wrong, please login again.."),n.logout())}).error(function(e){alert("Something went Wrong, please login again..",e),n.logout()})},o.selectedAddress={},o.selectAddress=function(){o.finalLatLng.lat=o.selectedAddress.geometry.location.lat,o.finalLatLng.lng=o.selectedAddress.geometry.location.lng,google.maps.event.trigger(map,"resize"),o.map.setCenter(new google.maps.LatLng(o.finalLatLng.lat,o.finalLatLng.lng)),o.map.setZoom(14)},o.placeName="",o.placeNameSearchResults="",o.findByPlaceName=function(){t.get("api/find_location_by_place_name",{params:{lat:o.finalLatLng.lat,lng:o.finalLatLng.lng,placename:o.placeName}}).success(function(e){e.success?(o.placeNameSearchResults=e.data.results,console.log(o.placeNameSearchResults)):(alert("Something went Wrong, please login again.."),n.logout())}).error(function(e){alert("Something went Wrong, please login again..",e),n.logout()})},o.selectedPlaceName={},o.selectPlaceName=function(){o.finalLatLng.lat=o.selectedPlaceName.geometry.location.lat,o.finalLatLng.lng=o.selectedPlaceName.geometry.location.lng,o.finalLatLng.name=o.selectedPlaceName.name,google.maps.event.trigger(map,"resize"),o.selectedPlaceName.infowindow=new google.maps.InfoWindow({content:o.selectedPlaceName.name}),o.selectedPlaceName.marker&&o.selectedPlaceName.marker.setMap(null),o.selectedPlaceName.marker=new google.maps.Marker({position:new google.maps.LatLng(o.finalLatLng.lat,o.finalLatLng.lng),title:o.selectedPlaceName.name}),o.selectedPlaceName.marker.setMap(o.map),o.selectedPlaceName.infowindow.open(o.map,o.selectedPlaceName.marker),o.map.setCenter(new google.maps.LatLng(o.finalLatLng.lat,o.finalLatLng.lng)),o.map.setZoom(16)},o.igShowDone=!1,o.confirm=function(){o.selectedPlaceName.marker.setMap(null);var e=o.finalLatLng.lat-o.centerLatLng.lat,a=o.finalLatLng.lng-o.centerLatLng.lng,l=a>=0?Math.atan(e/a):Math.PI+Math.atan(e/a),i=Math.sin(l),r=Math.cos(l),c=Date.now(),s=parseInt(c+Math.abs(e/i*1e5*1e3)),g={name:o.finalLatLng.name,igId:o.igNewPic.id,igImage:o.igNewPic.image,igLink:o.igNewPic.link,lat:o.centerLatLng.lat,lng:o.centerLatLng.lng,endLat:o.finalLatLng.lat,endLng:o.finalLatLng.lng,latVel:i,lngVel:r,created_at:c,arrived_at:s};t.post("api/balloons",g).success(function(e){e.success?(console.log(e.data),o.balloons.push(e.data),o.generateMarker(o.balloons[o.balloons.length-1]),o.map.setCenter(new google.maps.LatLng(e.data.lat,e.data.lng)),o.map.setZoom(12),o.igShowDone=!0):(alert("Something went Wrong, please login again.."),n.logout())}).error(function(e){alert("Something went Wrong, please login again..",e),n.logout()})},o.generateMarker=function(e,t){t<e.arrived_at?(e.curLat=e.lat+(e.endLat-e.lat)*(t-e.created_at)/(e.arrived_at-e.created_at),e.curLng=e.lng+(e.endLng-e.lng)*(t-e.created_at)/(e.arrived_at-e.created_at)):(e.curLat=e.endLat,e.curLng=e.endLng);var a=new google.maps.Marker({position:new google.maps.LatLng(e.curLat,e.curLng),title:e.name,igId:e.igId,icon:new google.maps.MarkerImage(e.igImage,null,null,null,new google.maps.Size(50,50))});o.oms.addListener("click",function(e,t){o.igShow(e)}),o.oms.addListener("spiderfy",function(e,t){o.balloons.forEach(function(t){e.forEach(function(e){t.igId==e.igId&&(t.stop=!0)})})}),o.oms.addListener("unspiderfy",function(e,t){o.balloons.forEach(function(t){e.forEach(function(e){t.igId==e.igId&&(t.stop=!1)})})}),o.oms.addMarker(a),e.marker=a,e.marker.setMap(o.map)},o.balloons=[],o.centerLatLng={lat:34.05223,lng:-118.24368},document.querySelector("ig-show").className="hidden",document.querySelector("ig-new").className="hidden";var l=function(e,t,a){var n=new google.maps.StyledMapType([{featureType:"landscape",stylers:[{hue:"#FFBB00"},{saturation:43.400000000000006},{lightness:37.599999999999994},{gamma:1}]},{featureType:"road.highway",stylers:[{hue:"#FFC200"},{saturation:-61.8},{lightness:45.599999999999994},{gamma:1}]},{featureType:"road.arterial",stylers:[{hue:"#FF0300"},{saturation:-100},{lightness:51.19999999999999},{gamma:1}]},{featureType:"road.local",stylers:[{hue:"#FF0300"},{saturation:-100},{lightness:52},{gamma:1}]},{featureType:"water",stylers:[{hue:"#0078FF"},{saturation:-13.200000000000003},{lightness:2.4000000000000057},{gamma:1}]},{featureType:"poi",stylers:[{hue:"#00FF6A"},{saturation:-1.0989010989011234},{lightness:11.200000000000017},{gamma:1}]}],{name:"map_style"}),l={zoom:a,center:new google.maps.LatLng(e,t),mapTypeControlOptions:{mapTypeIds:[google.maps.MapTypeId.ROADMAP,"map_style"]}};o.map=new google.maps.Map(document.getElementById("map"),l),o.map.mapTypes.set("map_style",n),o.map.setMapTypeId("map_style"),o.oms=new OverlappingMarkerSpiderfier(o.map,{circleFootSeparation:46,spiralFootSeparation:52});var i=Date.now();o.balloons.forEach(function(e){o.generateMarker(e,i)}),o.updateBalloons=setInterval(function(){var e=Date.now();o.balloons.forEach(function(t){!t.stop&&e<t.arrived_at&&(t.curLat=t.lat+(t.endLat-t.lat)*(e-t.created_at)/(t.arrived_at-t.created_at),t.curLng=t.lng+(t.endLng-t.lng)*(e-t.created_at)/(t.arrived_at-t.created_at),t.marker.setPosition(new google.maps.LatLng(t.curLat,t.curLng)))})},1e3)};t.get("api/balloons").success(function(e){e.success?(o.balloons=e.data,l(o.centerLatLng.lat,o.centerLatLng.lng,12)):(alert("Something went Wrong, please login again.."),n.logout())}).error(function(e){alert("Something went Wrong, please login again..",e),n.logout()}),e.$on("$destroy",function(){clearInterval(o.updateBalloons)})}angular.module("MapController",[]).controller("MapController",e),e.$inject=["$scope","$http","$window","Auth"]}(),function(){"use strict";function e(){return{restrict:"E",templateUrl:"directives/ig_show.html"}}function t(){return{restrict:"E",templateUrl:"directives/ig_new.html"}}angular.module("MapDirectives",[]).directive("igShow",e).directive("igNew",t)}(),function(){"use strict";function e(e,t){e.when("/",{templateUrl:"views/welcome.html",controller:"AppController",controllerAs:"appCtrl",requireLogin:!1}).when("/app",{templateUrl:"views/app.html",controller:"MapController",controllerAs:"mapCtrl",requireLogin:!0}).otherwise("/"),t.html5Mode(!0)}angular.module("app.routes",["ngRoute"]).config(e),e.$inject=["$routeProvider","$locationProvider"]}(),function(){"use strict";function e(e){e.interceptors.push("AuthInterceptor")}function t(e,t,a,n){e.$on("$locationChangeStart",function(e,o,l){for(var i in t.routes)-1!=o.indexOf(i)&&t.routes[i].requireLogin&&!n.isLoggedIn()&&(alert("Please login first :D"),e.preventDefault(),a.location.href="/")})}angular.module("iBalloon",["app.routes","ngCookies","AppController","MapController","AppService","AuthService","MapDirectives"]).config(e).run(t),e.$inject=["$httpProvider"],t.$inject=["$rootScope","$route","$window","Auth"]}();