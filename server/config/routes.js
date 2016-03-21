var trucks = require('./../controllers/trucks.js');

module.exports = function(myApp){

  myApp.get('/trucks', function(req, res){
    trucks.show(req, res);
  })

  myApp.post('/addTruck', function(req, res){
    trucks.add(req, res);
  })

};
