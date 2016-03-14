var cities = [
              {
                  city : 'New York',
                  desc : 'The Big Apple!',
                  lat : 40.6700,
                  long : -73.9400
              },
              {
                  city : 'Los Angeles',
                  desc : 'Cool town!',
                  lat : 34.0500,
                  long : -118.2500
              },
              {
                city : 'Chicago',
                desc : 'Description of city!',
                lat : 41.8819,
                long : -87.6278
              }
          ];

var myApp = angular.module('myApp', ['ngRoute', 'ngMessages']);

myApp.controller('mapsController', function ($scope) {

    var mapOptions = {
        zoom: 4,
        center: new google.maps.LatLng(25,80),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    }

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    $scope.markers = [];

    var infoWindow = new google.maps.InfoWindow();

    var createMarker = function (info){

        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(info.lat, info.long),
            title: info.city
        });
        marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';

        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
            infoWindow.open($scope.map, marker);
        });

        $scope.markers.push(marker);

    }

    for (i = 0; i < cities.length; i++){
        createMarker(cities[i]);
    }

    $scope.openInfoWindow = function(e, selectedMarker){
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
    }

});
