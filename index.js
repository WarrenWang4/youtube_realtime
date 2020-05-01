//Include express and socket.io modules.
var express = require('express');
var socket = require('socket.io');

//App setup
var app = express();

/*var server = app.listen(5000, function(){
	console.log('listening to Heroku port');
});*/
//Server setup
var server = app.listen(process.env.PORT || 5000, function(){
	console.log('listening to Heroku port');
});

//Static files
app.use(express.static('public'));

//Socket setup
var io = socket(server);
//Callback function below fires when server makes a socket connection with a client
io.on('connection', function(socket){
	console.log('made socket connection', socket.id);
	//When server receives "create" message from th client through the socket, the server subscribes the socket to the channel (group security token) provided by client.
	//Basically, the server adds the client to a room. The room's number identifier is group security token provided by the client when it sent the "chat" message down the socket to the server.
	socket.on('create', function(room){
		socket.join(room);
	});
	//Same process that occurs when server receives a "create" message occurs when server receives a "join" message.
	socket.on('join', function(room){
		socket.join(room);
	});
	//When server receives an "enterChat" message from client, the server relays an "enterChat" message to every client in the room of the client that originally sent the "enterChat" message.
	//In other words, the server sends an "enterChat" message down every socket within the channel (or group) of the client who originally sent the "enterChat" message.
	//The server knows the group of the client who originally sent the "enterChat" message because part of the "data" sent by the client included the group security token, which is the identifier for the group.
	socket.on('enterChat', function(data){
		io.in(data.groupToken).emit('enterChat', data.message);
	});
	//When server receives "play" request from client through the socket, the server relays a "play" message to every client in the specified group.
	//Again, the server konws the specified group because part of the "data" sent by the client who sent the play request is the group security token, which identifies the room the client who sent the play request is in. 
	socket.on('play', function(data){
		io.in(data).emit('play', 'play');
	});
	//Same thing that happens when server receives "play" request occurs except a "pause" message is sent down all sockets within the group of the orginal sender of the request.
	socket.on('pause', function(data){
		io.in(data).emit('pause', 'pause');
	});
	//Same thing that happens when server receives "play" request occurs except a "restart" message is sent down all sockets within the group of the orginal sender of the request.
	socket.on('restart', function(data){
		io.in(data).emit('restart', 'restart');
	});
	//When server receives "goback" message, server relays the "goback" message down all sockets within the channel of the socket down which the original request was sent.
	//In other words, server relays the "goback" message to all clients who are within the group of the client who originally sent the "goback" request down the socket
	socket.on('goback', function(data){
		io.in(data.groupToken).emit('goback', data.newTime);
	});
	//Same thing that occurs when server recieves a "goback" message occurs here, except a "goforward" messsage is sent to all clients within the specified group.
	socket.on('goforward', function(data){
		io.in(data.groupToken).emit('goforward', data.newTime);
	});
	//Same thing as "goforward" event except this time a "goforward2" message is sent to all clients in the specified group (this is the case for when a group member clicked "go forward" button that would have resulted in a time outside the duration of the video).
	socket.on('goforward2', function(data){
		io.in(data.groupToken).emit('goforward2', data.newTime);
	});
	//When server receives "chat" message it relays the message to all clients within the group of the client who originally sent the "chat" request.
	//This enables all members of group to get the chat message.
	socket.on('chat', function(data){
		io.in(data.groupToken).emit('chat', data);
	});
	//Same thing as chat message except this is for if someone is currently typing a message.
	socket.on('typing', function(data){
		socket.to(data.groupToken).emit('typing', data.handle);
	});
	//When server receives a "progress" message, it relays it to all members within group of sender.
	socket.on('progress', function(data){
		io.in(data.groupToken).emit('progress', data.newProgress);
	});
	//When server receives a "nextVideo" message, it relays it to all memebers within group of client who originally sent the "nextVideo" message.
	socket.on('nextVideo', function(data){
		io.in(data).emit('nextVideo', 'nextVideo');
	});
	//Same thing as "nextVideo" case except this time a "previousVideo" message is relayed to all members of the group of the sender.
	socket.on('previousVideo', function(data){
		io.in(data).emit('previousVideo', 'previousVideo');
	});
});

