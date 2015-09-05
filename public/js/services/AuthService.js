(function() {
  'use strict';
  angular.module('AuthService',[])
    .factory('Auth', Auth)
    .factory('AuthToken', AuthToken)
    .factory('AuthInterceptor', AuthInterceptor);

  Auth.$inject=['$window', '$http', '$q', '$location', 'AuthToken'];

  function Auth( $window, $http, $q, $location, AuthToken) {
    var authFactory={};
    authFactory.logout = function () {
      AuthToken.setToken();
      $window.location.href='/';
    };
    authFactory.isLoggedIn = function(){
      if(AuthToken.getToken()){
        return true;
      } else {
        return false;
      }
    };
    authFactory.getUser = function () {
      if(AuthToken.getToken())
        return $http.get('/api/me');
      else
        return $q.reject({ message: 'User has no token' });
    };
    return authFactory;
  }

  AuthToken.$inject=['$cookies'];

  function AuthToken($cookies) {
    var authTokenFactory = {};
    authTokenFactory.getToken = function(){
      return $cookies.get('token');
    };
    authTokenFactory.setToken = function (token) {
      if(token)
        $cookies.put('token', token);
      else
        $cookies.remove('token');
    };
    return authTokenFactory;
  }

  AuthInterceptor.$inject=['$q', '$window', '$location', 'AuthToken'];

  function AuthInterceptor($q, $window, $location, AuthToken) {
    var authInterceptorFactory={};
    authInterceptorFactory.request = function (config) {
      var token = AuthToken.getToken();
      if(token)
        config.headers['x-access-token'] = token;

      return config;
    };
    authInterceptorFactory.responseError = function (response) {
      if(response.status == 403){
        AuthToken.setToken();
        $window.location.href = '/';
      }
      return $q.reject(response);
    };
    return authInterceptorFactory;
  }

}());
