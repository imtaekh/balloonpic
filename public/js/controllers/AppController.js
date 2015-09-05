(function() {
  'use strict';
  angular.module("AppController",[])
    .controller("AppController",AppController);

  AppController.$inject=["$rootScope", "$window", "Auth"];

  function AppController($rootScope, $window, Auth){
    var vm = this;

    $rootScope.$on('$routeChangeStart',function () {

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

    });

    vm.login = function () {
      $window.location.href = "/auth/instagram";
    };
    vm.logout = function () {
      console.log("logout");
      Auth.logout();
    };


  }
}());
