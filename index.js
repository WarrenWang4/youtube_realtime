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

	socket.on('create', function(room){
		socket.join(room);
	});

	socket.on('join', function(room){
		socket.join(room);
	});

	socket.on('enterChat', function(data){
		io.in(data.groupToken).emit('enterChat', data.message);
	});

	socket.on('play', function(data){
		io.in(data).emit('play', 'play');
	});
	socket.on('pause', function(data){
		io.in(data).emit('pause', 'pause');
	});
	socket.on('restart', function(data){
		io.in(data).emit('restart', 'restart');
	});
	socket.on('goback', function(data){
		io.in(data.groupToken).emit('goback', data.newTime);
	});
	socket.on('goforward', function(data){
		io.in(data.groupToken).emit('goforward', data.newTime);
	});
	socket.on('goforward2', function(data){
		io.in(data.groupToken).emit('goforward2', data.newTime);
	});
	socket.on('chat', function(data){
		io.in(data.groupToken).emit('chat', data);
	});
	socket.on('typing', function(data){
		socket.to(data.groupToken).emit('typing', data.handle);
	});
	socket.on('progress', function(data){
		io.in(data.groupToken).emit('progress', data.newProgress);
	})
	socket.on('nextVideo', function(data){
		io.in(data).emit('nextVideo', 'nextVideo');
	})
	socket.on('previousVideo', function(data){
		io.in(data).emit('previousVideo', 'previousVideo');
	})
});

