var mongoose = require('mongoose');
var Truck = mongoose.model('Truck');

module.exports = (function(){
  return{
    show: function(req, res){
      Truck.find({}, function(err, results){
        if(err){
          console.log(err);
          res.json(err);
        } else {
          res.json(results);
        }
      })
    },

    add: function(req, res){
      var new_truck = new Truck({name: req.body.name, desc: req.body.desc, lat: req.body.lat, lon: req.body.lon});
      new_truck.save(function (err){
        if(err){
          console.log('failed to add new truck!');
          res.json(err);
        } else {
          console.log('successfully added to database!');
          Truck.find({}, function(err, results){
            if(err){
              console.log(err);
              res.json(err);
            } else {
              res.json(results);
            }
          })
        }
      })
   }

  }
})();
