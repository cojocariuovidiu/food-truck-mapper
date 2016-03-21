var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TrucksSchema = new mongoose.Schema({
    name: {type: String, required: true},
    desc: {type: String, required: true},
    lat: {type: String, required: true},
    lon: {type: String, required: true}
});

mongoose.model('Truck', TrucksSchema);
