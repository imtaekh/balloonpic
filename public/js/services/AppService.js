(function() {
  'use strict';
  angular.module("AppService",['ngRoute'])
    .factory("AppService", AppService);

  AppService.$inject = ["$location", "$window"];

  function AppService($location, $window) {
    var factory={};

    factory.checkToken = function () {
      var token = $location.search().token;
      if(token){
        console.log("if ", token);
      } else {
        $window.location.href = '/';
      }
    };

    return factory;
  }


}());
