myApp.controller('mapsController', function ($scope, mapFactory) {

   var mapOptions = {
       zoom: 11,
       center: new google.maps.LatLng(39.7201827,-104.9164698),
       mapTypeId: google.maps.MapTypeId.ROADMAP
   }

   $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
   $scope.trucks = [];

   function getLocation() {
      if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(showPosition, showError);
      } else {
         x.innerHTML = "Geolocation is not supported by this browser.";
      }
   }

   getLocation();

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

   var infoWindow = new google.maps.InfoWindow({
      maxWidth: 200
   });

   $scope.openInfoWindow = function(e, selectedMarker){
      e.preventDefault();
      google.maps.event.trigger(selectedMarker, 'click');
   }

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
