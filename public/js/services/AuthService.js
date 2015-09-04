(function() {
  'use strict';
  angular.module('AuthService',[])
    .factory('Auth', Auth)
    .factory('AuthToken', AuthToken)
    .factory('AuthInterceptor', AuthInterceptor);

  Auth.$inject=['$cookies', '$window', '$http', '$q', '$location', 'AuthToken'];

  function Auth($cookies, $window, $http, $q, $location, AuthToken) {
    var authFactory={};
    authFactory.logout = function () {
      AuthToken.setToken();
    };
    authFactory.isLoggedIn = function(){
      if(AuthToken.getToken()){
        return true;
      } else if($cookies.get("token")){
        AuthToken.setToken($cookies.get("token"));
        $cookies.remove("token");
        return true;
      } else {
        $window.location.href = '/';
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

  AuthToken.$inject=['$window'];

  function AuthToken($window) {
    var authTokenFactory = {};
    authTokenFactory.getToken = function(){
      return $window.localStorage.getItem('token');
    };
    authTokenFactory.setToken = function (token) {
      if(token)
        $window.localStorage.setItem('token', token);
      else
        $window.localStorage.removeItem('token');
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
