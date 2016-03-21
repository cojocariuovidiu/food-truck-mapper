myApp.config(function($routeProvider){
	 $routeProvider
	 		.when('/', {
	 			templateUrl: './../static/partials/home.html',
	 		})

			.when('/new_truck', {
				templateUrl: './../static/partials/new_truck.html',
				controller: 'mapsController'
			})

	        .otherwise({
	          redirectTo: '/'
	        })
});
