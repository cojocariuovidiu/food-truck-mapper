myApp.controller('mapsController', function ($scope, mapFactory) {

   // Initialize Map
   var mapOptions = {
      zoom: 11,
      center: new google.maps.LatLng(39.7201827,-104.9164698),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      scrollwheel: false,
   }

   $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
   $scope.trucks = [];

   // Get user's location
   function getLocation() {
      if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(showPosition, showError);
      } else {
         x.innerHTML = "Geolocation is not supported by this browser.";
      }
   }

   getLocation();

   // Show user's location
    function showPosition(position) {
      var latlon = position.coords.latitude + "," + position.coords.longitude;
      console.log(latlon);

      var user_marker = new google.maps.Marker({
         map: $scope.map,
         position: new google.maps.LatLng(position.coords.latitude , position.coords.longitude),
      });

      $scope.user_marker = user_marker;
   }

    function showError(error) {
      switch(error.code) {
         case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation."
            break;
         case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable."
            break;
         case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out."
            break;
         case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred."
            break;
       }
    }

    //Get trucks data from database
   mapFactory.getTrucks(function(data){
      $scope.trucks = data;
      $scope.markers = [];
      console.log(data);

      // Create markers for trucks and infoboxes when clicked
      var createMarker = function (data){

         var image = 'http://www.free-icons-download.net/images/truck-icon-3846.png';

         var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(data.lat, data.lon),
            title: data.name,
            content: data.desc,
            icon: image,
            animation: google.maps.Animation.DROP
         });

         google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<h5>' + marker.title + '</h5>' + marker.content);
            infoWindow.open($scope.map, marker);
         });

         $scope.markers.push(marker);
         console.log($scope.markers + 'creating markers');

      }

      for (i = 0; i < $scope.trucks.length; i++){
         createMarker($scope.trucks[i]);
         console.log('this is coming from the for loop');
      }

   })

   var infoWindow = new google.maps.InfoWindow({
      maxWidth: 200
   });

   $scope.openInfoWindow = function(e, selectedMarker){
      e.preventDefault();
      google.maps.event.trigger(selectedMarker, 'click');
   }

   // Add a new truck
   $scope.addTruck = function(){
      console.log('adding truck!');
      $scope.new_truck.created_at = new Date();
      mapFactory.addTruck($scope.new_truck, function(data){
         console.log('adding truck 2!');
         $scope.trucks = data;
         $scope.new_truck = {};
      })

      mapFactory.getTrucks(function(data){
         $scope.trucks = data;
         $scope.markers = [];
         console.log(data);

         var createMarker = function (data){

            var image = 'http://www.free-icons-download.net/images/truck-icon-3846.png';

            var marker = new google.maps.Marker({
               map: $scope.map,
               position: new google.maps.LatLng(data.lat, data.lon),
               title: data.name,
               content: data.desc,
               icon: image,
               animation: google.maps.Animation.DROP
            });

            google.maps.event.addListener(marker, 'click', function(){
               infoWindow.setContent('<h5>' + marker.title + '</h5>' + marker.content);
               infoWindow.open($scope.map, marker);
            });

            $scope.markers.push(marker);
            console.log($scope.markers + 'creating markers');

         }

         for (i = 0; i < $scope.trucks.length; i++){
            createMarker($scope.trucks[i]);
            console.log('this is coming from the for loop');
         }

      })
   }

// DIRECTIONS TO TRUCKS - IN PROGRESS!!!

   // initialize directions service
      directionsService = new google.maps.DirectionsService();
      directionsDisplay = new google.maps.DirectionsRenderer(
      {
         suppressMarkers: true,
         suppressInfoWindows: true
      });

      directionsDisplay.setMap(map);

      drawRoutes(location1, location2);

   function continueShowRoute(location1, location2)
	{
		// hide last line
		if (line)
		{
			line.setMap(null);
		}

   // show a line between the two points
		line = new google.maps.Polyline({
			map: map,
			path: [location1, location2],
			strokeWeight: 7,
			strokeOpacity: 0.8,
			strokeColor: "#FFAA00"
		});

		// compute distance between the two points
		var R = 6371;
		var dLat = toRad(location2.lat()-location1.lat());
		var dLon = toRad(location2.lng()-location1.lng());

		var dLat1 = toRad(location1.lat());
		var dLat2 = toRad(location2.lat());

		var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
				Math.cos(dLat1) * Math.cos(dLat1) *
				Math.sin(dLon/2) * Math.sin(dLon/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		var d = R * c;

		document.getElementById("distance_direct").innerHTML = "<br/>The distance between the two points (in a straight line) is: "+d;

		var travelmode = document.getElementById("travelMode").value;

		// get the selected travel mode
		if (travelmode == "driving")
			travel = google.maps.DirectionsTravelMode.DRIVING;
		else if (travelmode == "walking")
			travel = google.maps.DirectionsTravelMode.WALKING;
		else if (travelmode == "bicycling")
			travel = google.maps.DirectionsTravelMode.BICYCLING;

		// find and show route between the points
		var request = {
			origin:location1,
			destination:location2,
			travelMode: travel
		};
		directionsService.route(request, function(response, status)
		{
			if (status == google.maps.DirectionsStatus.OK)
			{
				directionsDisplay.setDirections(response);
				distance = "The distance between the two points on the chosen route is: "+response.routes[0].legs[0].distance.text;
				distance += "<br/>The aproximative "+travelmode+" time is: "+response.routes[0].legs[0].duration.text;
				document.getElementById("distance_road").innerHTML = distance;
			}
			else
			{
				alert('error: ' + status);
			}
		});

	function toRad(deg)
	{
		return deg * Math.PI/180;
	}
}

//    var destination = "Denver, Colorado";
//    var origin = new google.maps.LatLng(position.coords.latitude , position.coords.longitude);

//    var service = new google.maps.DistanceMatrixService();
//
//
//    service.getDistanceMatrix(
//      {
//        origins: [origin],
//        destinations: [destination],
//        travelMode: google.maps.TravelMode.WALKING,
//      }, callback);
//
//    function callback(response, status) {
//     if (status == google.maps.DistanceMatrixStatus.OK) {
//       var origins = response.originAddresses;
//       var destinations = response.destinationAddresses;
//
//       for (var i = 0; i < origins.length; i++) {
//          var results = response.rows[i].elements;
//          for (var j = 0; j < results.length; j++) {
//             var element = results[j];
//             var distance = element.distance.text;
//             var duration = element.duration.text;
//             var from = origins[i];
//             var to = destinations[j];
//         }
//       }
//     }
//   }
//
// console.log('after the service for get distance matrix and callback' + distance);

});
