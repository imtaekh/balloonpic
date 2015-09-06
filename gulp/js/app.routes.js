(function() {
	'use strict';
	angular.module('app.routes', ['ngRoute'])
		.config(RoutesConfig);

	RoutesConfig.$inject=["$routeProvider","$locationProvider"];
	function RoutesConfig($routeProvider, $locationProvider) {
		$routeProvider
			.when('/', {
				templateUrl : 'views/welcome.html',
				controller	: 'AppController',
				controllerAs: 'appCtrl',
				requireLogin: false
			})
			.when('/app', {
				templateUrl : 'views/app.html',
				controller 	: 'MapController',
				controllerAs: 'mapCtrl',
				requireLogin: true
			})
			.otherwise('/');
		$locationProvider.html5Mode(true);
	}

}());
