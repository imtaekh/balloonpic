angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

	$routeProvider
		.when('/', {
			templateUrl : 'views/welcome.html',
			requireLogin :false
		})
		.when('/app', {
			templateUrl : 'views/app.html',
			requireLogin :true
		})
		.otherwise('/');
	$locationProvider.html5Mode(true);

});
