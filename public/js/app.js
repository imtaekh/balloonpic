(function() {
  'use strict';
  angular.module("iBalloon",[
    "app.routes",
    "ngCookies",
    "AppController",
    "AppService",
    "AuthService"
  ]).config(appConfig)
    .run(appRun);

  appConfig.$inject=['$httpProvider'];
  function appConfig ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  }

  appRun.$inject=['$rootScope', '$route', '$location', 'Auth'];
  function appRun ($rootScope, $route, $location, Auth){
    $rootScope.$on("$locationChangeStart", function(event, next, current) {
      for(var i in $route.routes) {
        if(next.indexOf(i) != -1) {
          if($route.routes[i].requireLogin && !Auth.isLoggedIn()) {
            alert("Please login first :D");
            event.preventDefault();
            $location.path('/');
          }
        }
      }
    });
  }

}());
