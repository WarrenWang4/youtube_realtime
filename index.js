var express = require('express');
var socket = require('socket.io');

//App setup
var app = express();

/*var server = app.listen(5000, function(){
	console.log('listening to Heroku port');
});*/
var server = app.listen(process.env.PORT || 5000, function(){
	console.log('listening to Heroku port');
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
	socket.on('restart', function(data){
		io.sockets.emit('restart', data);
		console.log(data);
	});
	socket.on('goback', function(data){
		io.sockets.emit('goback', data);
		console.log(data);
	});
	socket.on('goforward', function(data){
		io.sockets.emit('goforward', data);
		console.log(data);
	});
	socket.on('goforward2', function(data){
		io.sockets.emit('goforward2', data);
		console.log(data);
	});
	socket.on('chat', function(data){
		io.sockets.emit('chat', data);
	});
	socket.on('typing', function(data){
		socket.broadcast.emit('typing', data);
	});
	socket.on('progress', function(data){
		io.sockets.emit('progress', data);
	})
	socket.on('nextVideo', function(data){
		io.sockets.emit('nextVideo', data);
		console.log(data);
	})
	socket.on('previousVideo', function(data){
		io.sockets.emit('previousVideo', data);
		console.log(data);
	})
});

