var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ubicacion = new Schema({
	nombre: String
});

module.exports = mongoose.model('Ubicacion', ubicacion);