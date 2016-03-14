myApp.config(function($routeProvider){
	 $routeProvider
	 		.when('/', {
	 			templateUrl: './../static/partials/home.html',
	 		})

	        .otherwise({
	          redirectTo: '/'
	        })
});
