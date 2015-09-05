(function() {
  'use strict';
  angular.module("iBalloon",["app.routes","ngCookies","AppController","AppService","AuthService"])
  .config(function($httpProvider) {

    // attach our auth interceptor to the http requests
    $httpProvider.interceptors.push('AuthInterceptor');
  });
}());
