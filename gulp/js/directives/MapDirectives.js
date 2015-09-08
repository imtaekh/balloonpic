(function() {
  'use strict';

  angular.module("MapDirectives",[])
    .directive("igShow",igShow)
    .directive("igNew",igNew);

    function igShow() {
      return {
        restrict: 'E',
        templateUrl: 'directives/ig_show.html'
      };
    }
    function igNew() {
      return {
        restrict: 'E',
        templateUrl: 'directives/ig_new.html'
      };
    }

}());
