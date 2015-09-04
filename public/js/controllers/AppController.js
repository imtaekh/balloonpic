(function() {
  'use strict';
  angular.module("AppController",[])
    .controller("AppController",AppController);

  AppController.$inject=["$rootScope", "Auth"];

  function AppController($rootScope, Auth){
    console.log(Auth);
    var vm = this;
    vm.isLoggedIn = Auth.isLoggedIn();

    $rootScope.$on('$routeChangeStart',function () {
      vm.isLoggedIn = Auth.isLoggedIn();
    });

    console.log("vm.isLoggedIn :", vm.isLoggedIn);

  }
}());
