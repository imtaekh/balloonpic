(function() {
  'use strict';
  angular.module("AppController",[])
    .controller("AppController",AppController);

  AppController.$inject=["$rootScope", "AppService"];

  function AppController($rootScope, AppService){
    $rootScope.$on('$routeChangeStart',function () {
      AppService.checkToken();
    });

    AppService.checkToken();



    var vm = this;


  }
}());
