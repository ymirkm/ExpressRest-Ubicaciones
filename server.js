var http = require('http');
var expressServer = require('./app/expressServer');
var config = require('./config');

var app = new expressServer();

var server = http.createServer(app.expressServer);
server.listen(config.port, function(err){
	console.log('Servidor corriendo desde el puerto', config.port);
});