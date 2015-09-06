(function() {
  'use strict';
  angular.module('AuthService',[])
    .factory('Auth', Auth)
    .factory('AuthToken', AuthToken)
    .factory('AuthInterceptor', AuthInterceptor);

  Auth.$inject=['$http', '$q', '$location', 'AuthToken'];

  function Auth($http, $q, $location, AuthToken) {
    var authFactory={};
    authFactory.logout = function () {
      AuthToken.setToken();
      $location.path('/');
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

  AuthInterceptor.$inject=['$q', '$location', 'AuthToken'];

  function AuthInterceptor($q, $location, AuthToken) {
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
        $location.path('/');
      }
      return $q.reject(response);
    };
    return authInterceptorFactory;
  }

}());
