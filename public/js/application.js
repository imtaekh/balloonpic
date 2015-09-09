!function(){"use strict";function e(e,t){var n={};return n}angular.module("AppService",["ngRoute"]).factory("AppService",e),e.$inject=["$location","$window"]}(),function(){"use strict";function e(e,t,n,a){var l={};return l.logout=function(){a.setToken(),n.path("/")},l.isLoggedIn=function(){return a.getToken()?!0:!1},l.getUser=function(){return a.getToken()?e.get("/api/me"):t.reject({message:"User has no token"})},l}function t(e){var t={};return t.getToken=function(){return e.get("token")},t.setToken=function(t){t?e.put("token",t):e.remove("token")},t}function n(e,t,n){var a={};return a.request=function(e){var t=n.getToken();return t&&(e.headers["x-access-token"]=t),e},a.responseError=function(a){return 403==a.status&&(n.setToken(),t.path("/")),e.reject(a)},a}angular.module("AuthService",[]).factory("Auth",e).factory("AuthToken",t).factory("AuthInterceptor",n),e.$inject=["$http","$q","$location","AuthToken"],t.$inject=["$cookies"],n.$inject=["$q","$location","AuthToken"]}(),function(){"use strict";function e(e,t,n){var a=this;a.initialize=function(){n.getUser().then(function(e){e.data.success?a.user=e.data.data:delete a.user,a.isLoggedIn=a.user?!0:!1,console.log("USER : ",a.user)})},a.initialize(),e.$on("$routeChangeStart",a.initialize),a.login=function(){t.location.href="/auth/instagram"},a.logout=function(){console.log("logout"),n.logout(),delete a.user},a.menuStyle="collapse navbar-collapse",a.menuClick=function(){"navbar-collapse"==a.menuStyle?a.menuStyle="collapse navbar-collapse":a.menuStyle="navbar-collapse"}}angular.module("AppController",[]).controller("AppController",e),e.$inject=["$rootScope","$window","Auth"]}(),function(){"use strict";function e(e,t,n){var a=this;a.leftPanel="",a.myIgPics=[],a.igShow=function(){"igShow"==a.leftPanel?(a.leftPanel="",document.querySelector("#map").className="map_inactive",document.querySelector("#side").className="side_inactive"):"igNew"==a.leftPanel?(a.leftPanel="igShow",document.querySelector("ig-show").className="",document.querySelector("ig-new").className="hidden"):(a.leftPanel="igShow",document.querySelector("ig-show").className="",document.querySelector("ig-new").className="hidden",document.querySelector("#map").className="map_active",document.querySelector("#side").className="side_active")},a.igIndex=function(){e.get("api/my_ig").success(function(e){e.success?a.myIgPics=e.data:(alert("Something went Wrong, please login again.."),n.logout())}).error(function(e){alert("Something went Wrong, please login again.."),n.logout()})},a.igNew=function(){console.log("IGNEW :",a.leftPanel),"igNew"==a.leftPanel?(a.leftPanel="",document.querySelector("#map").className="map_inactive",document.querySelector("#side").className="side_inactive"):"igShow"==a.leftPanel?(a.leftPanel="igNew",document.querySelector("ig-show").className="hidden",document.querySelector("ig-new").className="",a.igIndex(),a.startOver()):(a.leftPanel="igNew",document.querySelector("ig-show").className="hidden",document.querySelector("ig-new").className="",document.querySelector("#map").className="map_active",document.querySelector("#side").className="side_active",a.igIndex(),a.startOver())},a.unSelectPic=function(){a.igNewPic=void 0;for(var e=document.querySelectorAll(".my_ig_pic_con_hidden"),t=0;t<e.length;t++)e[t].className="col-xs-4 my_ig_pic_con";var n=document.querySelector(".my_ig_pic_con_selected");n&&(n.className="col-xs-4 my_ig_pic_con")},a.startOver=function(){a.unSelectPic(),a.finalLatLng={},a.locationAddress="",a.locationAddressId="",a.locationAddressSearchResults="",a.selectedAddress={},a.placeName="",a.placeNameId="",a.placeNameSearchResults="",a.selectedPlaceName={}},a.igNewPic=void 0,a.selectPic=function(e){if(a.igNewPic)a.unSelectPic();else{var t=document.getElementById(e);a.igNewPic={id:e,image:t.dataset.image,link:t.dataset.link},console.log(a.igNewPic);for(var n=document.querySelectorAll(".my_ig_pic_con"),l=0;l<n.length;l++)n[l].className="my_ig_pic_con_hidden";t.className="my_ig_pic_con_selected",a.igShowSelectedPic=e}},a.finalLatLng={},a.locationAddress="",a.locationAddressSearchResults="",a.findByAddress=function(){e.get("api/find_location_by_address",{params:{address:a.locationAddress}}).success(function(e){e.success?(a.locationAddressSearchResults=e.data,console.log(a.locationAddressSearchResults)):(alert("Something went Wrong, please login again.."),n.logout())}).error(function(e){alert("Something went Wrong, please login again.."),n.logout()})},a.selectedAddress={},a.selectAddress=function(e){var t=document.getElementById("address_"+a.selectedAddressId);a.selectedAddress.name=t.dataset.name,a.selectedAddress.lat=t.dataset.lat,a.selectedAddress.lng=t.dataset.lng,a.finalLatLng.lat=t.dataset.lat,a.finalLatLng.lng=t.dataset.lng,google.maps.event.trigger(map,"resize"),a.map.setCenter(new google.maps.LatLng(a.finalLatLng.lat,a.finalLatLng.lng)),a.map.setZoom(14)},a.placeName="",a.placeNameSearchResults="",a.findByPlaceName=function(){e.get("api/find_location_by_place_name",{params:{lat:a.selectedAddress.lat,lng:a.selectedAddress.lng,placename:a.placeName}}).success(function(e){e.success?(a.placeNameSearchResults=e.data.results,console.log(e.data.results)):(alert("Something went Wrong, please login again.."),n.logout())}).error(function(e){alert("Something went Wrong, please login again.."),n.logout()})},a.selectedPlaceName={},a.selectPlaceName=function(){var e=document.getElementById("place_"+a.selectedPlaceNameId);a.selectedPlaceName.name=e.dataset.name,a.selectedPlaceName.lat=e.dataset.lat,a.selectedPlaceName.lng=e.dataset.lng,a.finalLatLng.lat=e.dataset.lat,a.finalLatLng.lng=e.dataset.lng,google.maps.event.trigger(map,"resize"),a.map.setCenter(new google.maps.LatLng(a.finalLatLng.lat,a.finalLatLng.lng)),a.map.setZoom(16)},a.confirm=function(){console.log("vm.igNewPic.id",a.igNewPic.id),console.log("vm.igNewPic.image",a.igNewPic.image),console.log("vm.igNewPic.link",a.igNewPic.link),console.log("vm.centerLatLng.lat:",a.centerLatLng.lat),console.log("vm.centerLatLng.lng:",a.centerLatLng.lng),console.log("vm.finalLatLng.lat:",a.finalLatLng.lat),console.log("vm.finalLatLng.lng:",a.finalLatLng.lng),console.log("vm.finalLatLng.name:",a.finalLatLng.name);var e,t=a.finalLatLng.lat-a.centerLatLng.lat,n=a.finalLatLng.lng-a.centerLatLng.lng;console.log("latDif:",t),console.log("lngDif:",n),n>=0?(console.log("if"),e=Math.atan(t/n)):0>=n&&(console.log("else"),e=Math.PI+Math.atan(t/n)),console.log("rad:",e);var l=.001*Math.sin(e),o=.001*Math.cos(e);console.log("latVel:",l),console.log("lngVel:",o)},a.markers=[{lat:34.052,lng:-118.243,endLat:34.0900091,endLng:-118.3617443,latVel:.0003047649261696503,lngVel:-.000952427603430732,imgUrl:"http://www.keenthemes.com/preview/metronic/theme/assets/global/plugins/jcrop/demos/demo_files/image1.jpg"},{lat:34.052,lng:-118.243,endLat:34.0194543,endLng:-118.4911912,latVel:-.00013127510333688666,lngVel:-.000991345977569834,imgUrl:"http://www.keenthemes.com/preview/metronic/theme/assets/global/plugins/jcrop/demos/demo_files/image1.jpg"}],a.centerLatLng={lat:34.05223,lng:-118.24368},document.getElementById("map").style.height=window.innerHeight-50+"px",document.querySelector("ig-show").className="hidden",document.querySelector("ig-new").className="hidden";var l=function(e,t,n){var l={zoom:n,center:new google.maps.LatLng(e,t)};a.map=new google.maps.Map(document.getElementById("map"),l),a.markers.forEach(function(e){e.marker=new google.maps.Marker({position:new google.maps.LatLng(e.lat,e.lng),title:e.name,icon:new google.maps.MarkerImage(e.igImage,null,null,null,new google.maps.Size(60,60))}),e.marker.setMap(a.map),google.maps.event.addListener(e.marker,"click",a.igShow)}),setInterval(function(){a.markers.forEach(function(e){e.latVel>0&&e.endLat>e.lat?e.lat+=e.latVel:e.latVel<0&&e.endLat<e.lat&&(e.lat+=e.latVel),e.lngVel>0&&e.endLng>e.lng?(console.log("if"),e.lng+=e.lngVel):e.lngVel<0&&e.endLng<e.lng&&(console.log("else"),e.lng+=e.lngVel),e.marker.setPosition(new google.maps.LatLng(e.lat,e.lng))})},100)};e.get("api/balloons").success(function(e){e.success?(a.markers=e.data,console.log(e.data),l(a.centerLatLng.lat,a.centerLatLng.lng,12)):(alert("Something went Wrong, please login again.."),n.logout())}).error(function(e){alert("Something went Wrong, please login again.."),n.logout()})}angular.module("MapController",[]).controller("MapController",e),e.$inject=["$http","$window","Auth"]}(),function(){"use strict";function e(){return{restrict:"E",templateUrl:"directives/ig_show.html"}}function t(){return{restrict:"E",templateUrl:"directives/ig_new.html"}}angular.module("MapDirectives",[]).directive("igShow",e).directive("igNew",t)}(),function(){"use strict";function e(e,t){e.when("/",{templateUrl:"views/welcome.html",controller:"AppController",controllerAs:"appCtrl",requireLogin:!1}).when("/app",{templateUrl:"views/app.html",controller:"MapController",controllerAs:"mapCtrl",requireLogin:!0}).otherwise("/"),t.html5Mode(!0)}angular.module("app.routes",["ngRoute"]).config(e),e.$inject=["$routeProvider","$locationProvider"]}(),function(){"use strict";function e(e){e.interceptors.push("AuthInterceptor")}function t(e,t,n,a){e.$on("$locationChangeStart",function(e,l,o){for(var c in t.routes)-1!=l.indexOf(c)&&t.routes[c].requireLogin&&!a.isLoggedIn()&&(alert("Please login first :D"),e.preventDefault(),n.location.href="/")})}angular.module("iBalloon",["app.routes","ngCookies","AppController","MapController","AppService","AuthService","MapDirectives"]).config(e).run(t),e.$inject=["$httpProvider"],t.$inject=["$rootScope","$route","$window","Auth"]}();