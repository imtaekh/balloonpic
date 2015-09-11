!function(){"use strict";function e(e,t){var n={};return n}angular.module("AppService",["ngRoute"]).factory("AppService",e),e.$inject=["$location","$window"]}(),function(){"use strict";function e(e,t,n,a){var o={};return o.logout=function(){a.setToken(),n.path("/")},o.isLoggedIn=function(){return a.getToken()?!0:!1},o.getUser=function(){return a.getToken()?e.get("/api/me"):t.reject({message:"User has no token"})},o}function t(e){var t={};return t.getToken=function(){return e.get("token")},t.setToken=function(t){t?e.put("token",t):e.remove("token")},t}function n(e,t,n){var a={};return a.request=function(e){var t=n.getToken();return t&&(e.headers["x-access-token"]=t),e},a.responseError=function(a){return 403==a.status&&(n.setToken(),t.path("/")),e.reject(a)},a}angular.module("AuthService",[]).factory("Auth",e).factory("AuthToken",t).factory("AuthInterceptor",n),e.$inject=["$http","$q","$location","AuthToken"],t.$inject=["$cookies"],n.$inject=["$q","$location","AuthToken"]}(),function(){"use strict";function e(e,t,n){var a=this;a.initialize=function(){n.getUser().then(function(e){e.data.success?a.user=e.data.data:delete a.user,a.isLoggedIn=a.user?!0:!1,console.log("USER : ",a.user)})},a.initialize(),e.$on("$routeChangeStart",a.initialize),a.login=function(){t.location.href="/auth/instagram"},a.logout=function(){console.log("logout"),n.logout(),delete a.user},a.menuStyle="collapse navbar-collapse",a.menuClick=function(){"navbar-collapse"==a.menuStyle?a.menuStyle="collapse navbar-collapse":a.menuStyle="navbar-collapse"}}angular.module("AppController",[]).controller("AppController",e),e.$inject=["$rootScope","$window","Auth"]}(),function(){"use strict";function e(e,t,n,a){var o=this;o.leftPanel="",o.myIgPics=[],o.igPic={},o.socket=io(),o.closeLeftPanel=function(){o.leftPanel="",document.querySelector("#map").className="map_inactive",document.querySelector("#side").className="side_inactive",setTimeout(function(){google.maps.event.trigger(map,"resize")},1e3)},o.formatDate=function(e){var t=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];return(1==e.getHours().toString().length?"0"+e.getHours():e.getHours())+":"+(1==e.getMinutes().toString().length?"0"+e.getMinutes():e.getMinutes())+" "+t[e.getMonth()]+" "+(1==e.getDate().toString().length?"0"+e.getDate():e.getDate())+", "+e.getFullYear()},o.formatDuration=function(e){var t=parseInt(e/1e3),n=0,a=0,o=0,i="";return t>86400&&(n=parseInt(t/86400),t-=86400*n,i+=n+" days "),t>3600&&(a=parseInt(t/3600),t-=3600*a,i+=a+" hours "),t>60&&(o=parseInt(t/60),t-=60*o,i+=o+" mins "),i+=t+" secs"},o.igShowIsRunning=!1,o.igShowDetailToggle=function(){"detail_inactive"==o.igPic.detailClass?(o.igPic.detailClass="detail_active",o.igPic.detailBtnClass="hidden"):(o.igPic.detailClass="detail_inactive",o.igPic.detailBtnClass="btn btn-default btn-detail")},o.igShow=function(e){if(!o.igShowIsRunning){o.igShowIsRunning=!0,o.igPic.balloon=e;var n=Date.now();o.igPic.created_at=o.formatDate(new Date(o.igPic.balloon.data.created_at)),o.igPic.arrived_at=o.formatDate(new Date(o.igPic.balloon.data.arrived_at)),e.data.arrived_at>n?(o.igPic.status="Flying to",o.igPic.arrived=!1,o.igPic.travelTime=o.formatDuration(n-o.igPic.balloon.data.created_at)):(o.igPic.status="Arrived at",o.igPic.arrived=!0,o.igPic.travelTime=o.formatDuration(o.igPic.balloon.data.arrived_at-o.igPic.balloon.data.created_at)),o.igPic.detailClass="detail_inactive",o.igPic.detailBtnClass="btn btn-default btn-detail",t.get("api/show_ig",{params:{igid:e.igId}}).success(function(e){e.success?(o.igPic.ig=e.data,o.leftPanel==o.igPic.ig.id?o.closeLeftPanel():"igNew"==o.leftPanel?(o.leftPanel=o.igPic.igId,document.querySelector("ig-show").className="",document.querySelector("ig-new").className="hidden"):(o.leftPanel=o.igPic.ig.id,document.querySelector("ig-show").className="",document.querySelector("ig-new").className="hidden",document.querySelector("#map").className="map_active",document.querySelector("#side").className="side_active"),o.igShowIsRunning=!1):(alert("Something went Wrong, please login again.."),a.logout())}).error(function(e){alert("Something went Wrong, please login again..",e),a.logout()})}},o.igIndex=function(){t.get("api/my_ig").success(function(e){e.success?o.myIgPics=e.data:(alert("Something went Wrong, please login again.."),a.logout())}).error(function(e){alert("Something went Wrong, please login again..",e),a.logout()})},o.igNew=function(){"igNew"==o.leftPanel?o.closeLeftPanel():o.leftPanel?(o.leftPanel="igNew",document.querySelector("ig-show").className="hidden",document.querySelector("ig-new").className="",o.igIndex(),o.startOver()):(o.leftPanel="igNew",document.querySelector("ig-show").className="hidden",document.querySelector("ig-new").className="",document.querySelector("#map").className="map_active",document.querySelector("#side").className="side_active",o.igIndex(),o.startOver())},o.unSelectPic=function(){o.igNewPic=void 0;for(var e=document.querySelectorAll(".my_ig_pic_con_hidden"),t=0;t<e.length;t++)e[t].className="col-xs-4 my_ig_pic_con";var n=document.querySelector(".my_ig_pic_con_selected");n&&(n.className="col-xs-4 my_ig_pic_con")},o.startOver=function(){o.unSelectPic(),o.locationAddress="",o.locationAddressSearchResults="",o.selectedAddress={},o.placeName="",o.placeNameSearchResults="",o.selectedPlaceName={},o.finalDestination.marker&&o.finalDestination.marker.setMap(null),o.finalDestination={},o.igShowDone=!1},o.igNewPic=void 0,o.selectPic=function(e){if(o.igNewPic)o.unSelectPic();else{var t=document.getElementById(e);o.igNewPic={id:e,image:t.dataset.image,link:t.dataset.link};for(var n=document.querySelectorAll(".my_ig_pic_con"),a=0;a<n.length;a++)n[a].className="my_ig_pic_con_hidden";t.className="my_ig_pic_con_selected",o.igShowSelectedPic=e}},o.finalDestination={},o.locationAddress="",o.locationAddressSearchResults="",o.findByAddress=function(){t.get("api/find_location_by_address",{params:{address:o.locationAddress}}).success(function(e){e.success?o.locationAddressSearchResults=e.data:(alert("Something went Wrong, please login again.."),a.logout())}).error(function(e){alert("Something went Wrong, please login again..",e),a.logout()})},o.generateDestinationMarker=function(e,t){var n="<h4>"+e+"</h4>";t&&(n+="<h5>"+t+"</h5>"),o.finalDestination.infowindow=new google.maps.InfoWindow({content:n}),o.finalDestination.marker&&o.finalDestination.marker.setMap(null),o.finalDestination.marker=new google.maps.Marker({position:new google.maps.LatLng(o.finalDestination.lat,o.finalDestination.lng),title:e}),o.finalDestination.marker.setMap(o.map),o.finalDestination.infowindow.open(o.map,o.finalDestination.marker)},o.selectedAddress={},o.selectAddress=function(){o.finalDestination.lat=o.selectedAddress.geometry.location.lat,o.finalDestination.lng=o.selectedAddress.geometry.location.lng,o.generateDestinationMarker(o.selectedAddress.formatted_address),o.selectedAddress.address_components.forEach(function(e){var t=!1;if(e.types.forEach(function(e){"political"==e&&(t=!0)}),!t){var n=o.selectedAddress.formatted_address;n=n.replace(e.long_name,""),n=n.replace(e.short_name,""),o.selectedAddress.formatted_address=n}}),o.selectedAddress.formatted_address=o.selectedAddress.formatted_address.split(",").map(function(e){return e.trim()}).filter(function(e){return""!==e}).join(", "),o.finalDestination.name=o.selectedAddress.formatted_address,google.maps.event.trigger(map,"resize"),o.map.setCenter(new google.maps.LatLng(o.finalDestination.lat,o.finalDestination.lng)),o.map.setZoom(14)},o.placeName="",o.placeNameSearchResults="",o.findByPlaceName=function(){t.get("api/find_location_by_place_name",{params:{lat:o.selectedAddress.geometry.location.lat,lng:o.selectedAddress.geometry.location.lng,placename:o.placeName}}).success(function(e){e.success?o.placeNameSearchResults=e.data.results:(alert("Something went Wrong, please login again.."),a.logout())}).error(function(e){alert("Something went Wrong, please login again..",e),a.logout()})},o.selectedPlaceName={},o.selectPlaceName=function(){o.selectedPlaceName&&(o.finalDestination.lat=o.selectedPlaceName.geometry.location.lat,o.finalDestination.lng=o.selectedPlaceName.geometry.location.lng,o.finalDestination.name=o.selectedPlaceName.name,google.maps.event.trigger(map,"resize"),o.generateDestinationMarker(o.selectedPlaceName.name,o.selectedPlaceName.vicinity),o.map.setCenter(new google.maps.LatLng(o.finalDestination.lat,o.finalDestination.lng)),o.map.setZoom(16))},o.igShowDone=!1,o.confirm=function(){o.finalDestination.marker.setMap(null);var e=o.finalDestination.lat-o.centerLatLng.lat,n=o.finalDestination.lng-o.centerLatLng.lng,i=n>=0?Math.atan(e/n):Math.PI+Math.atan(e/n),r=Math.sin(i),l=Math.cos(i),s=Date.now(),c=parseInt(s+Math.abs(e/r*4e4*1e3)),g={name:o.finalDestination.name,igId:o.igNewPic.id,igImage:o.igNewPic.image,igLink:o.igNewPic.link,lat:o.centerLatLng.lat,lng:o.centerLatLng.lng,endLat:o.finalDestination.lat,endLng:o.finalDestination.lng,latVel:r,lngVel:l,created_at:s,arrived_at:c};window.navigator.geolocation.getCurrentPosition(function(e){o.centerLatLng.lat=e.coords.latitude,o.centerLatLng.lng=e.coords.longitude,t.post("api/balloons",g).success(function(e){e.success?(console.log("sending balloon",e.data),o.socket.emit("newBalloon",e.data),o.map.setCenter(new google.maps.LatLng(e.data.lat,e.data.lng)),o.map.setZoom(12),o.igShowDone=!0):(alert("Something went Wrong, please login again.."),a.logout())}).error(function(e){alert("Something went Wrong, please login again..",e),a.logout()})},function(e){})},o.socket.on("newBalloon",function(e){o.balloons.push(e),o.generateMarker(o.balloons[o.balloons.length-1])}),o.generateMarker=function(e,t){t<e.arrived_at?(e.curLat=e.lat+(e.endLat-e.lat)*(t-e.created_at)/(e.arrived_at-e.created_at),e.curLng=e.lng+(e.endLng-e.lng)*(t-e.created_at)/(e.arrived_at-e.created_at)):(e.curLat=e.endLat,e.curLng=e.endLng);var n=new google.maps.Marker({position:new google.maps.LatLng(e.curLat,e.curLng),title:e.name,igId:e.igId,icon:new google.maps.MarkerImage(e.igImage,null,null,null,new google.maps.Size(50,50))});o.oms.addListener("click",function(e,t){o.igShow(e)}),o.oms.addListener("spiderfy",function(e,t){o.balloons.forEach(function(t){e.forEach(function(e){t.igId==e.igId&&(t.stop=!0)})})}),o.oms.addListener("unspiderfy",function(e,t){o.balloons.forEach(function(t){e.forEach(function(e){t.igId==e.igId&&(t.stop=!1)})})}),o.oms.addMarker(n),e.marker=n,e.marker.data=e,e.marker.setMap(o.map)},o.balloons=[],o.centerLatLng={lat:34.05223,lng:-118.24368},document.querySelector("ig-show").className="hidden",document.querySelector("ig-new").className="hidden";var i=function(e,t,n){var a=new google.maps.StyledMapType([{featureType:"landscape",stylers:[{hue:"#FFBB00"},{saturation:43.400000000000006},{lightness:37.599999999999994},{gamma:1}]},{featureType:"road.highway",stylers:[{hue:"#FFC200"},{saturation:-61.8},{lightness:45.599999999999994},{gamma:1}]},{featureType:"road.arterial",stylers:[{hue:"#FF0300"},{saturation:-100},{lightness:51.19999999999999},{gamma:1}]},{featureType:"road.local",stylers:[{hue:"#FF0300"},{saturation:-100},{lightness:52},{gamma:1}]},{featureType:"water",stylers:[{hue:"#0078FF"},{saturation:-13.200000000000003},{lightness:2.4000000000000057},{gamma:1}]},{featureType:"poi",stylers:[{hue:"#00FF6A"},{saturation:-1.0989010989011234},{lightness:11.200000000000017},{gamma:1}]}],{name:"map_style"}),i={zoom:n,center:new google.maps.LatLng(e,t),disableDefaultUI:!0,mapTypeControlOptions:{mapTypeIds:[google.maps.MapTypeId.ROADMAP,"map_style"]}};o.map=new google.maps.Map(document.getElementById("map"),i),o.map.mapTypes.set("map_style",a),o.map.setMapTypeId("map_style"),o.oms=new OverlappingMarkerSpiderfier(o.map,{circleFootSeparation:46,spiralFootSeparation:52});var r=Date.now();o.balloons.forEach(function(e){o.generateMarker(e,r)}),o.updateBalloons=setInterval(function(){var e=Date.now();o.igPic.arrived===!1&&(o.igPic.travelTime=o.formatDuration(e-o.igPic.balloon.data.created_at),document.querySelector("#liveTravelingTime").innerText=o.igPic.travelTime),o.balloons.forEach(function(t){!t.stop&&e<t.arrived_at&&(t.curLat=t.lat+(t.endLat-t.lat)*(e-t.created_at)/(t.arrived_at-t.created_at),t.curLng=t.lng+(t.endLng-t.lng)*(e-t.created_at)/(t.arrived_at-t.created_at),t.marker.setPosition(new google.maps.LatLng(t.curLat,t.curLng)))})},1e3)};t.get("api/balloons").success(function(e){e.success?o.balloons=e.data:(alert("Something went Wrong, please login again.."),a.logout())}).error(function(e){alert("Something went Wrong, please login again..",e),a.logout()}),window.navigator.geolocation.getCurrentPosition(function(e){o.centerLatLng.lat=e.coords.latitude,o.centerLatLng.lng=e.coords.longitude,i(o.centerLatLng.lat,o.centerLatLng.lng,12)},function(e){}),o.myLocation=function(){window.navigator.geolocation.getCurrentPosition(function(e){o.centerLatLng.lat=e.coords.latitude,o.centerLatLng.lng=e.coords.longitude,o.map.setCenter(new google.maps.LatLng(o.centerLatLng.lat,o.centerLatLng.lng)),o.map.setZoom(12)},function(e){})},e.$on("$destroy",function(){clearInterval(o.updateBalloons)})}angular.module("MapController",[]).controller("MapController",e),e.$inject=["$scope","$http","$window","Auth"]}(),function(){"use strict";function e(){return{restrict:"E",templateUrl:"directives/ig_show.html"}}function t(){return{restrict:"E",templateUrl:"directives/ig_new.html"}}angular.module("MapDirectives",[]).directive("igShow",e).directive("igNew",t)}(),function(){"use strict";function e(e,t){e.when("/",{templateUrl:"views/welcome.html",controller:"AppController",controllerAs:"appCtrl",requireLogin:!1}).when("/app",{templateUrl:"views/app.html",controller:"MapController",controllerAs:"mapCtrl",requireLogin:!0}).otherwise("/"),t.html5Mode(!0)}angular.module("app.routes",["ngRoute"]).config(e),e.$inject=["$routeProvider","$locationProvider"]}(),function(){"use strict";function e(e){e.interceptors.push("AuthInterceptor")}function t(e,t,n,a){e.$on("$locationChangeStart",function(e,o,i){for(var r in t.routes)-1!=o.indexOf(r)&&t.routes[r].requireLogin&&!a.isLoggedIn()&&(alert("Please login first :D"),e.preventDefault(),n.location.href="/")})}angular.module("iBalloon",["app.routes","ngCookies","AppController","MapController","AppService","AuthService","MapDirectives"]).config(e).run(t),e.$inject=["$httpProvider"],t.$inject=["$rootScope","$route","$window","Auth"]}();