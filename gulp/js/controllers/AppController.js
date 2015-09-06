(function() {
  'use strict';
  angular.module("AppController",[])
    .controller("AppController",AppController);

  AppController.$inject=["$rootScope", "$window", "Auth"];

  function AppController($rootScope, $window, Auth){
    var vm = this;

    vm.initialize = function () {
      Auth.getUser()
      .then(function (data) {
        if(data.data.success){
          vm.user = data.data.data;
        }
        else{
          delete vm.user;
        }
        vm.isLoggedIn=vm.user?true:false;
        console.log("USER : ", vm.user);
      });
    };
    vm.initialize();
    $rootScope.$on('$routeChangeStart',vm.initialize);

    vm.login = function () {
      $window.location.href = "/auth/instagram";
    };
    vm.logout = function () {
      console.log("logout");
      Auth.logout();
      delete vm.user;
    };
    vm.menuStyle = "collapse navbar-collapse";
    vm.menuClick = function () {
      if(vm.menuStyle == "navbar-collapse"){
        vm.menuStyle = "collapse navbar-collapse";
      } else {
        vm.menuStyle = "navbar-collapse";
      }
    };

  }
}());
