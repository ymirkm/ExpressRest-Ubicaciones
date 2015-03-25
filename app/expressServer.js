var express 	= require('express');
var middlewares = require('./middlewares/admin'); 
var swig 		= require('swig');
var mongoose 	= require('mongoose');
var Ubicacion 	= require('../db/ubicacion');		//Schema de Ubicacion

var ExpressServer = function(config){
	config = config || {};

	this.expressServer = express();
	/************************************************************************** Carga de Middlewares ****/
	for(var middleware in middlewares){
		this.expressServer.use(middlewares[middleware]);
	}


	/************************************************************************** Template engine ****/
	this.expressServer.engine('html', swig.renderFile);
	this.expressServer.set('view engine', 'html');
	this.expressServer.set('views', __dirname + 'ubicaciones/website/views/templates');
	this.expressServer.set('view cache', false);


	/************************************************************************** Conexión base de datos ****/
	mongoose.connect('mongodb://localhost/ubicaciones', function(err, res){
		if(err){
			console.log('Error estableciendo conexion con la base de datos ' + err);
		}
	});

	this.expressServer.get('/saluda/', function(err, res){
		res.render('saluda', {saludo:'Hola ;)'});
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
			if(err){ console.log('Error al guardar nueva ubicacion ' + err); }
		});
		res.send(objSave);
	});

	this.expressServer.get(/add_ubicacion/, function(req, res){
		res.render('add_ubicacion', {});
	});


	/************************************************************************** Guardar ubicacion enviada por (post) ****/
	this.expressServer.post('/add_ubicacion/', function(req, res){
		var objSave = new Ubicacion({
			nombre: req.body.ubicacion
		});
		// objSave.save(function(err){
		// 	if(!err){
		// 		console.log('Ubicacion guardada con exito');
		// 	}else { console.log('Error al guardar nueva ubicacion ' + err); }
		// });
		res.send(objSave);
	});
};
module.exports = ExpressServer;
