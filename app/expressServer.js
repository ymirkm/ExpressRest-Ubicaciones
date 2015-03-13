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
	mongoose.connect('mongodb:localhost/ubicaciones', function(err, res){
		if(err){
			console.log('Error estableciendo conexion con la base de datos ' + err);
		}
	});

	this.expressServer.get('/Hola/', function(req, res, next){
		res.send('Hola desde Servidor Modularizado');
	});

	this.expressServer.get('/ubicaciones/', function(req, ubicaciones, next){
		Ubicacion.find(function(err,res, next){
			if(!err){
				res.send(ubicaciones);
			}else{ res.send('Error en GET ' + err); }
		});
	});

	this.expressServer.get('/postPrueba/:nombre', function(req, res){
		console.log(req.params.nombre);
		res.send('Peticion a /postPrueba/' + req.params.nombre);
	});

	this.expressServer.post('/postPrueba/', function(req, res){
		console.log(req.body.nombre);
		var objSave = new Ubicacion({
			nombre: req.body.mombre
		});
		objSave.save(function(err){
			if(!err){
				console.log('Ubicacion guardada con exito');
			}else { console.log('Error al guardar nueva ubicacion ' + err); }
		});
	});
};
module.exports = ExpressServer;
