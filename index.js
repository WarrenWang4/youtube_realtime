var express = require('express');
var socket = require('socket.io');

//App setup
var app = express();


var server = app.listen(5000, function(){
	console.log('listening to requests on port 5000');
});

//Static files
app.use(express.static('public'));

//Socket setup
var io = socket(server);

io.on('connection', function(socket){
	console.log('made socket connection', socket.id);

	socket.on('play', function(data){
		io.sockets.emit('play', data);
		console.log(data);
	});
	socket.on('pause', function(data){
		io.sockets.emit('pause', data);
		console.log(data);
	});
});

