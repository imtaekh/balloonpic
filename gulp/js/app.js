(function() {
  'use strict';
  angular.module("iBalloon",[
    "app.routes",
    "ngCookies",
    "AppController",
    "MapController",
    "AppService",
    "AuthService",
    "MapDirectives"
  ]).config(appConfig)
    .run(appRun);

  appConfig.$inject=['$httpProvider'];
  function appConfig ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  }

  appRun.$inject=['$rootScope', '$route', '$window', 'Auth'];
  function appRun ($rootScope, $route, $window, Auth){
    $rootScope.$on("$locationChangeStart", function(event, next, current) {
      for(var i in $route.routes) {
        if(next.indexOf(i) != -1) {
          if($route.routes[i].requireLogin && !Auth.isLoggedIn()) {
            alert("Please login first :D");
            event.preventDefault();
            $window.location.href='/';
          }
        }
      }
    });
  }

}());
