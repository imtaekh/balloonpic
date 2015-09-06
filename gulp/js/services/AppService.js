(function() {
  'use strict';
  angular.module("AppService",['ngRoute'])
    .factory("AppService", AppService);

  AppService.$inject = ["$location", "$window"];

  function AppService($location, $window) {
    var factory={};

    return factory;
  }

}());
