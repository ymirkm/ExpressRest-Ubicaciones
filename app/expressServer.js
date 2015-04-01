var express 	= require('express');
var middlewares = require('./middlewares/admin'); 
var swig 		= require('swig');
var mongoose 	= require('mongoose');
var Ubicacion 	= require('../db/ubicacion');		//Location Schema
var geolib		= require('geolib');				
var location_test = require('../ubicaciones');

var ExpressServer = function(config){
	config = config || {};

	this.expressServer = express();
	/************************************************************************** Load Middlewares ****/
	for(var middleware in middlewares){
		this.expressServer.use(middlewares[middleware]);
	}


	/************************************************************************** Template engine ****/
	this.expressServer.engine('html', swig.renderFile);
	this.expressServer.set('view engine', 'html');
	this.expressServer.set('views', __dirname + '/website/views/templates');
	this.expressServer.set('view cache', false);


	/************************************************************************** Database Conection ****/
	mongoose.connect('mongodb://localhost/ubicaciones', function(err, res){
		if(err){
			console.log('Error establishing conection with database  ' + err);
		}
	});

	this.expressServer.get('/saluda/', function(err, res){
		res.render('saluda', {saludo:'ha ;)'});
	});


	/************************************************************************** GET all locations ****/
	this.expressServer.get('/ubicaciones/', function(req, res, next){
		Ubicacion.find(function(err,ubicaciones){
			if(!err){
				res.send(ubicaciones);
			}else{ res.send('Error on GET ' + err); }
		});
	});


	/************************************************************************** GET save a location ****/
	this.expressServer.get('/add_ubicacion/:ubicacion', function(req, res){
		var paramNUbicaion = req.params.ubicacion;
		var objSave = new Ubicacion({
			nombre: paramNUbicaion
		});
		objSave.save(function(err){
			if(err){ console.log('Error saving sended location ' + err); }
		});
		res.send(objSave);
	});

	/************************************************************************** GET render view add_ubicacion.html ****/
	this.expressServer.get(/add_ubicacion/, function(req, res){
		res.render('add_ubicacion', {});
	});


	/************************************************************************** POST save a location ****/
	this.expressServer.post('/add_ubicacion/', function(req, res){
		var objSave = new Ubicacion({
			nombre: req.body.ubicacion
		});
		objSave.save(function(err){
		 	if(!err){
		 		console.log('Location saved successfully');
			}else { console.log('Error saving sended location ' + err); }
		});
		res.send(objSave);
	});


	/****************************************************
	*			Distance between two points				*
	****************************************************/

	/************************************************************************** GET distance between two points ****/
	this.expressServer.get('/distance/', function(req, res){
		var distance = geolib.getDistance({ latitude: location_test.EsquinaElepco.lat, longitude: location_test.EsquinaElepco.lon },
										  { latitude: location_test.EsquinaJuliana.lat, longitude: location_test.EsquinaJuliana.lon });
		res.send('Distancia esquina Elepco y Juliana: ' + distance + ' mts');
	});

	/************************************************************************** GET render view get_distance.html given one point ****/
	// this.expressServer.get('/get_distance/', function(req, res){
	// 	res.render('get_distance', {});
	// });

	/************************************************************************** POST distance between two points given one of them ****/
	this.expressServer.post('/get_distance/', function(req, res){
		var lat = req.body.latitud;
		var lon = req.body.longitud;
		var distance = geolib.getDistance({ latitude: location_test.LocalHenry.lat, longitude: location_test.LocalHenry.lon },
										  { latitude: lat, longitude: lon });
		res.send('Distancia: ' + distance + ' mts');
	});

	/************************************************************************** GET distance between two points given one of them ****/
	this.expressServer.get('/get_distance/', function(req, res){
		var lat = req.query.lat;
		var lon = req.query.lon;
		var distance = geolib.getDistance({ latitude: location_test.LocalHenry.lat, longitude: location_test.LocalHenry.lon },
										  { latitude: lat, longitude: lon });
		var objSave = new Ubicacion({
			nombre: 'Enviado desde Modem'
		});
		objSave.save(function(err){
		 	if(!err){
		 		console.log('Location saved successfully');
			}else { console.log('Error saving sended location ' + err); }
		});
		res.send('' + distance + '*');
	});

	/****************************************************
	*				Is point in circle					*
	****************************************************/


};
module.exports = ExpressServer;
