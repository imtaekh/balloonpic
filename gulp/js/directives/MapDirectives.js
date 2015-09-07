(function() {
  'use strict';

  angular.module("MapDirectives",[])
    .directive("igShow",igShow)
    .directive("igPost",igPost);

    function igShow() {
      return {
        restrict: 'E',
        templateUrl: 'directives/ig_show.html'
      };
    }
    function igPost() {
      return {
        restrict: 'E',
        templateUrl: 'directives/ig_post.html'
      };
    }

}());
