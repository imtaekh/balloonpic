angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

	$routeProvider

		// route for the home page
		.when('/', {
			templateUrl : 'views/welcome.html'
		})

		// login page
		.when('/app', {
			templateUrl : 'views/app.html',
		})

		// show all users


		// form to create a new user
		// same view as edit page


		// page to edit a user


	$locationProvider.html5Mode(true);

});
