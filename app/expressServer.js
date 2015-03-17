var express = require('express');
var middlewares = require('./middlewares/admin'); 
var mongoose = require('mongoose');
var Ubicacion = require('../db/ubicacion');		//Schema de Ubicacion

var ExpressServer = function(config){
	config = config || {};

	this.expressServer = express();
	/************************************************************************** Carga de Middlewares ****/
	for(var middleware in middlewares){
		this.expressServer.use(middlewares[middleware]);
	}

	/************************************************************************** Conexión base de datos ****/
	mongoose.connect('mongodb://localhost/ubicaciones', function(err, res){
		if(err){
			console.log('Error estableciendo conexion con la base de datos ' + err);
		}
	});

	this.expressServer.get('/saluda/', function(err, res){
		res.send('Servidor saludando desde /saluda/ por metodo GET');
	});
	/************************************************************************** Obtener todas las ubicaciones guardadas ****/
	this.expressServer.get('/ubicaciones/', function(req, res, next){
		Ubicacion.find(function(err,ubicaciones){
			if(!err){
				res.send(ubicaciones);
			}else{ res.send('Error en GET ' + err); }
		});
	});
	/************************************************************************** Guardar ubicacion enviada por URL(get) ****/
	this.expressServer.get('/add_ubicacion/:ubicacion', function(req, res){
		var paramNUbicaion = req.params.ubicacion;
		var objSave = new Ubicacion({
			nombre: paramNUbicaion
		});
		objSave.save(function(err){
			if(!err){
				console.log('Ubicacion guardada con exito');
			}else { console.log('Error al guardar nueva ubicacion ' + err); }
		});
		res.send(objSave);
	});

	this.expressServer.get(/add_ubicacion/, function(req, res){
		var html = '<form action="/add_ubicacion/" method="post">' +
               'Enter your name:' +
               '<input type="text" name="ubicacion" />' +
               '<br>' +
               '<button type="submit">Submit</button>' +
            '</form>';
		res.send(html);
	});

	this.expressServer.post('/add_ubicacion/', function(req, res){
		/*console.log('pepe');
		var objSave = new Ubicacion({
			nombre: 'Pepe'
		});
		objSave.save(function(err){
			if(!err){
				console.log('Ubicacion guardada con exito');
			}else { console.log('Error al guardar nueva ubicacion ' + err); }
		});
		res.send(objSave);*/
		console.log(req.body);
		res.send('Nombre: ' + req.body.ubicacion);
	});
};
module.exports = ExpressServer;
