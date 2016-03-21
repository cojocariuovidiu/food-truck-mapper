var myApp = angular.module('myApp', ['ngRoute', 'ngMessages']);

myApp.factory('mapFactory', function($http) {

  var factory = {};

   factory.getTrucks = function(callback){
      $http.get('/trucks').success(function(output){
         callback(output);
      })
   }

   factory.addTruck = function(new_truck, callback){
      $http.post('/addTruck', new_truck).success(function(output){
        callback(output);
      })
   }

  return factory;

})
