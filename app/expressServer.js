var express = require('express');
var middlewares = require('./middlewares/admin'); 

var ExpressServer = function(config){
	config = config || {};

	this.expressServer = express();

	/************************************************************************** Carga de Middlewares ****/
	for(var middleware in middlewares){
		this.expressServer.use(middlewares[middleware]);
	}

	this.expressServer.get('/Hola/', function(req, res, next){
		res.send('Hola desde Servidor Modularizado');
	});

	this.expressServer.get('/test/', function(req, res, next){
		res.send('Hola desde Test!!!');
	});

	this.expressServer.get('/postPrueba/:nombre', function(req, res){
		console.log(req.params.nombre);
		res.send('Peticion a /postPrueba/' + req.params.nombre);
	});

	this.expressServer.post('/postPrueba/', function(req, res){
		console.log(req.body);
		res.send(req.body);
	});
};
module.exports = ExpressServer;
