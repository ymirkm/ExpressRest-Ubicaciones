var http = require('http');
var expressServer = require('./app/expressServer');
var config = require('./config');

var app = new expressServer();

var server = http.createServer(app.expressServer);
server.listen(config.port, function(err){
	if(!err){
		console.log('Server running on port:', config.port); 
	}else { console.log('Error trying to run server: ', err); }
});