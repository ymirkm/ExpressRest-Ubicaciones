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

	this.expressServer.get('/Hola/', function(req, res, next){
		res.send('Hola desde Servidor Modularizado');
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
	this.expressServer.get('/postPrueba/:nombre', function(req, res){
		var paramNombre = req.params.nombre;
		console.log(paramNombre);
		var objSave = new Ubicacion({
			nombre: paramNombre
		});
		objSave.save(function(err){
			if(!err){
				console.log('Ubicacion guardada con exito');
			}else { console.log('Error al guardar nueva ubicacion ' + err); }
		});
		res.send(objSave);
	});

	this.expressServer.post('/postPrueba/', function(req, res){
		var paramNombre = req.body.nombre;
		console.log('pepe');
		var objSave = new Ubicacion({
			nombre: 'Pepe'
		});
		objSave.save(function(err){
			if(!err){
				console.log('Ubicacion guardada con exito');
			}else { console.log('Error al guardar nueva ubicacion ' + err); }
		});
		res.send(objSave);
	});
};
module.exports = ExpressServer;
