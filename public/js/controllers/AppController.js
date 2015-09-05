(function() {
  'use strict';
  angular.module("AppController",[])
    .controller("AppController",AppController);

  AppController.$inject=["$rootScope", "$window", "Auth"];

  function AppController($rootScope, $window, Auth){
    console.log(Auth);
    var vm = this;
    vm.isLoggedIn = Auth.isLoggedIn();

    $rootScope.$on('$routeChangeStart',function () {
      vm.isLoggedIn = Auth.isLoggedIn();
    });

    vm.login = function () {
      $window.location.href = "/auth/instagram";
    };
    vm.logout = function () {
      console.log("logout");
      Auth.logout();
    };

    console.log("vm.isLoggedIn :", vm.isLoggedIn);

  }
}());
