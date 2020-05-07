var should = require('should');
var io = require('socket.io-client');
var mocha = require('mocha')
  var describe = mocha.describe
  var it = mocha.it

//test user
let appUser1 = {'name':'Jack', 'groupToken':'1111111111111'};
describe("Server",function(){
	/* Test 1 - New User enters chat/group and lets everyone in their group know about it */
	it('Should emit new user once they connect',function(done){
	//Line below connects client to server (this will serve as our mock client for the first test)
    var client = io.connect('http://localhost:5000/');
    //When client connects to server, the client emits a "create" message to the server containing the group security token. The server will then create a video-watching group for the client.
    //Next, the client emits an "enterChat" message to the server. The server will then relay this message to everyone in the group of the sender (including the sender).
    client.on('connect', function(data){
    client.emit('create', appUser1.groupToken);
      client.emit('enterChat', {
      message: appUser1.name + " has entered the chat",
      groupToken: appUser1.groupToken
  });
});
//If the client receives the "enterChat" message relay from the server, that means that the server is handling the enter chat request correctly, because the server relays the enter chat message to all clients connected to the group of the sender. This includes the sender client, which in this case is the variable "client".
client.on('enterChat',function(data){
      /* If this client doesn't disconnect it will interfere 
      with the next test */
      client.disconnect();
      //Finish test
      done(); 
    });
});


	/* Test 2 - User sends play request*/
	//Plsy request is for playing the current video displayed on the screens of all of the members of the group.
	it('Should emit play message down all sockets within group if request is sent (including sender socket)',function(done){
		//Connect another dummy client (since we had to disconnect the client used in test #1).
		   var client = io.connect('http://localhost:5000/');
		   //When client connects to server, client will emit a "join" message to the server. The server will then join the client to a group based on the group security token provided by the client.
		   //Next, the client emits a "play" message to the server. The server then sends this message to everyone in the group so that all of the clients in the group play the video on the screen.
		client.on('connect', function(data){
			client.emit('join', appUser1.groupToken);
			client.emit('play', appUser1.groupToken);
  });
		//If client recevies the "play" message from the sever, we know that the server is handling the "play" request properly, because the server is supposed to relay the "play" message to every client within the group of the sender. One of these clients, like for the rest of requests (except the "typing" request), is the sender of the initial message, which in this case is the variable "client".
client.on('play',function(data){
	client.disconnect();
	done();
});
});
	/* Test 3 - User sends play request, make sure message sets sent to separate client */
	it('Should emit play message down all sockets within group if request is sent (double check to see if other clients would receive message)',function(done){
		   //Now we are going to test to make sure that the messages are being relayed not just back to the sender of the message, but also to all the other clients in the group of the sender. This is why we connect two dummy clients as opposed to one.
		   //This is pretty much guarunteed to work since it already was proven in test #2 that the server is relaying the message to everyone in the group, but it doesn't hurt to make sure that the message is getting relayed to different clients, not just the sender of the initial message.
		   var client = io.connect('http://localhost:5000/');
		   var client2 = io.connect('http://localhost:5000/');
		   //When the first client ( called "client") connects, the first client (called "client") emits a "join" message to the server. The server then takes that request and joins the sender client to the group with the group security token specified by the sender.
		client.on('connect', function(data){
			client.emit('join', appUser1.groupToken);
		});
		//When the second client ("client2") connects, the second client ("client2") emits a "join" message to the server. The server then, like for "client", takes that request and joins the sender client (now "client2") to the group with the group security token specified by the sender.
		//Next, the first client ("client") emits a play request to the server. The server then takes that request and sends a "play" message to all of the clients in the group.
		client2.on('connect', function(data){
			client2.emit('join', appUser1.groupToken);
			client.emit('play', appUser1.groupToken);
  });
		//From Test #2, we know that the sender of the play request receives the relayed version of the request from the server. But, what about a separate client within the group? Do they receive the play message?
		//That is exactly what we are testing below: we are trying to see if "client2" received the play message from the server. To clarify, the play message was originally sent from "client" to the server. The server then sent basically that same message to all clients connected to the server, including "clint" and "client2". We already know that it gets sent to "client" from the server, below is the check to see if the message from the server is sent to "client2".
client2.on('play',function(data){
	client.disconnect();
	client2.disconnect();
	done();
});
});

	/* Test 4 - User sends pause request */
	//Pause request is for pausing the current video the group is watching.
	//Same process as described in the test #2 for the "play" request occurs here, where we are just testing to see if the sender of the "pause" message gets the message they sent to the server back from the server (so that the sender client's video player will pause the video at the same time as every other client in the group).
	it('Should emit pause message down all sockets within group if request is sent',function(done){
		   var client = io.connect('http://localhost:5000/');

		client.on('connect', function(data){
			client.emit('join', appUser1.groupToken);
			client.emit('pause', appUser1.groupToken);
  });
client.on('pause',function(data){
	client.disconnect();
	done();
});
});
	/* Test 5 - User sends pause request, make sure message sets sent to separate client */
	//Same process as described in test #3 occurs here, where we are checking to see if a separate client in the group of the sender of the "pause" message received that "pause" message from the server. If test #4 passes, that means that the sender client's video player will know when to pause. IF the following test (test #5) passes, that means that we know that all of the other clients in the group of the sender client also know when to pause the video.
	//Again, these tests involving two clients are kind of redundant, but worth checking.
	it('Should emit pause message down all sockets within group if request is sent (double check to see if other clients would receive message)',function(done){
		   var client = io.connect('http://localhost:5000/');
		   var client2 = io.connect('http://localhost:5000/');
		client.on('connect', function(data){
			client.emit('join', appUser1.groupToken);
		});
		client2.on('connect', function(data){
			client2.emit('join', appUser1.groupToken);
			client.emit('pause', appUser1.groupToken);
  });
client2.on('pause',function(data){
	client.disconnect();
	client2.disconnect();
	done();
});
});

	/* Test 6 - User sends restart request */
	//Same thing as one client case for play and pause requests.
	//Restart request is for restarting the current video the group is watching.
	it('Should emit restart message down all sockets within group if request is sent',function(done){
   var client = io.connect('http://localhost:5000/');

		client.on('connect', function(data){
			client.emit('join', appUser1.groupToken);
			client.emit('restart', appUser1.groupToken);
  });
client.on('restart',function(data){
	client.disconnect();
	done();
});
});

/* Test 7 - User sends restart request, make sure message sets sent to separate client */
//Same thing as two client case for play and pause request.
	it('Should emit restart message down all sockets within group if request is sent (double check to see if other clients would receive message)',function(done){
		   var client = io.connect('http://localhost:5000/');
		   var client2 = io.connect('http://localhost:5000/');
		client.on('connect', function(data){
			client.emit('join', appUser1.groupToken);
		});
		client2.on('connect', function(data){
			client2.emit('join', appUser1.groupToken);
			client.emit('restart', appUser1.groupToken);
  });
client2.on('restart',function(data){
	client.disconnect();
	client2.disconnect();
	done();
});
});
	/* Test 8 - User sends go back request */
	//Same thing as one client case for play, pause, and restart requests.
	//"goback" request is for going back ten seconds in time in the current video being watched by the group.
	it('Should emit goback message down all sockets within group is sent',function(done){
		   var client = io.connect('http://localhost:5000/');
		   //new time (current video time minus ten seconds)
		   let newTimeTest = 200;
		client.on('connect', function(data){
			client.emit('join', appUser1.groupToken);
			let testGoBackObj = {groupToken: appUser1.groupToken, newTime: newTimeTest};
      client.emit('goback', testGoBackObj);
  });
client.on('goback',function(data){
	data.should.equal(newTimeTest);
	client.disconnect();
	done();
});
});

	/* Test 9 - User sends go back request, make sure message sets sent to separate client */
	//Same thing as two client case for play, pause, and restart requests.
	it('Should emit go back message down all sockets within group if request is sent (double check to see if other clients would receive message)',function(done){
		   var client = io.connect('http://localhost:5000/');
		   var client2 = io.connect('http://localhost:5000/');
		   let newTimeTest = 200;
		client.on('connect', function(data){
			client.emit('join', appUser1.groupToken);
		});
		client2.on('connect', function(data){
			client2.emit('join', appUser1.groupToken);
			let testGoBackObj = {groupToken: appUser1.groupToken, newTime: newTimeTest};
			client.emit('goback', testGoBackObj);
  });
client2.on('goback',function(data){
	data.should.equal(newTimeTest);
	client.disconnect();
	client2.disconnect();
	done();
});
});

/* Test 10 - User sends go forward request */
//Same thing as one client case for play, pause, restart, and go back requests.
//"goforward" requests skips forward ten seconds in the current video being watched by the group.
	it('Should emit goforward message down all sockets within group is sent',function(done){
		   var client = io.connect('http://localhost:5000/');
		   //new time (current video time + 10 seconds). Again, it's just a dummy value.
		   let newTime2Test = 300;
		client.on('connect', function(data){
			client.emit('join', appUser1.groupToken);
			let testGoForwardObj = {groupToken: appUser1.groupToken, newTime: newTime2Test};
      client.emit('goforward', testGoForwardObj);
  });
client.on('goforward',function(data){
	data.should.equal(newTime2Test);
	client.disconnect();
	done();
});
});

/* Test 11 - User sends go forward request, make sure message sets sent to separate client */
//Same thing as for two client case for play, pause, restart, and go back requests.
	it('Should emit go forward message down all sockets within group if request is sent (double check to see if other clients would receive message)',function(done){
		   var client = io.connect('http://localhost:5000/');
		   var client2 = io.connect('http://localhost:5000/');
		   let newTime2Test = 200;
		client.on('connect', function(data){
			client.emit('join', appUser1.groupToken);
		});
		client2.on('connect', function(data){
			client2.emit('join', appUser1.groupToken);
			let testGoForwardObj = {groupToken: appUser1.groupToken, newTime: newTime2Test};
			client.emit('goforward', testGoForwardObj);
  });
client2.on('goforward',function(data){
	data.should.equal(newTime2Test);
	client.disconnect();
	client2.disconnect();
	done();
});
});

/* Test 12 - User sends go forward 2 request */
//Same thing as one client case for all the previous requests.
//"forward2" request is for if user in the group clicks "go forward" and current video time plus ten seconds is greater than the total time duration of the video.
	it('Should emit goforward2 message down all sockets within group is sent',function(done){
	   var client = io.connect('http://localhost:5000/');
	   let newTime3Test = 400;
		client.on('connect', function(data){
			client.emit('join', appUser1.groupToken);
			let testGoForward2Obj = {groupToken: appUser1.groupToken, newTime: newTime3Test};
      client.emit('goforward2', testGoForward2Obj);
  });
client.on('goforward2',function(data){
	data.should.equal(newTime3Test);
	client.disconnect();
	done();
});
});
	/* Test 13 - User sends go forward 2 request, make sure message sets sent to separate client */
	it('Should emit go forward 2 message down all sockets within group if request is sent (double check to see if other clients would receive message)',function(done){
		   var client = io.connect('http://localhost:5000/');
		   var client2 = io.connect('http://localhost:5000/');
		   let newTime3Test = 200;
		client.on('connect', function(data){
			client.emit('join', appUser1.groupToken);
		});
		client2.on('connect', function(data){
			client2.emit('join', appUser1.groupToken);
			let testGoForward2Obj = {groupToken: appUser1.groupToken, newTime: newTime3Test};
			client.emit('goforward2', testGoForward2Obj);
  });
client2.on('goforward2',function(data){
	data.should.equal(newTime3Test);
	client.disconnect();
	client2.disconnect();
	done();
});
});

	/* Test 14 - User sends chat request */
	//Same thing as one client case for all previous requests.
	//"chat" request is for sending a chat to everyone else in the group (including yourself so that you can see the messages that you have sent).
	it('Should emit chat message down all sockets within group is sent',function(done){
		   var client = io.connect('http://localhost:5000/');
		   let chatObjTest = {
				message: 'Hello',
				handle: appUser1.name,
				groupToken: appUser1.groupToken
			}
		client.on('connect', function(data){
			client.emit('join', appUser1.groupToken);
			
      client.emit('chat', chatObjTest);
  });
client.on('chat',function(data){
	data.should.match(chatObjTest);
	client.disconnect();
	done();
});
});

	/* Test 15 - User sends chat request, make sure message sets sent to separate client */
	//Same thing as two-client case for all previous requests.
	it('Should emit chat message down all sockets within group if request is sent (double check to see if other clients would receive message)',function(done){
		   var client = io.connect('http://localhost:5000/');
		   var client2 = io.connect('http://localhost:5000/');
		   let chatObjTest = {
				message: 'Hello',
				handle: appUser1.name,
				groupToken: appUser1.groupToken
			}
		client.on('connect', function(data){
			client.emit('join', appUser1.groupToken);
		});
		client2.on('connect', function(data){
			client2.emit('join', appUser1.groupToken);
			client.emit('chat', chatObjTest);
  });
client2.on('chat',function(data){
	data.should.match(chatObjTest);
	client.disconnect();
	client2.disconnect();
	done();
});
});
	/* Test 16 - User sends typing request */
	//"typing" request is for when someone in the group is currently typing a chat message and everyone else in the chat is alerted that the sender of the "typing" message is currently typing a chat message.
	//This request is a little different from the rest of the requests that are being tested in this file (such as play, pause, restart, go back, etc.). This is because in the case where someone is typing a message, the person typing the message does not need to be alerted that they are currently typing a message - however, everyone else in the group chat should be alerted fo this. That is why the server broadcasts the message to the group as opposed to emmitting the message to every client in the group.
	//If the "typing" message request was like all of the others described in this file (like play, pause, restart, go back, etc.), the sender would receive a "typing" message themselves. That is why the message must be broadcasted by the server to all of the other members of the group (excluding the server), so the one client case described in some of the previous tests does not apply here.
	it('Should broadcast typing message down all sockets within group except sender is sent',function(done){
		   var client = io.connect('http://localhost:5000/');
		   var client2 = io.connect('http://localhost:5000/');
		   let typingObjTest = {
				handle: appUser1.name,
				groupToken: appUser1.groupToken
			}
		client.on('connect', function(data){
			client.emit('join', appUser1.groupToken);
		});
		client2.on('connect', function(data){
			client2.emit('join', appUser1.groupToken);
			client.emit('typing', typingObjTest);
  });
client2.on('typing',function(data){
	data.should.equal(typingObjTest.handle);
	client.disconnect();
	client2.disconnect();
	done();
});
});

	/* Test 17 - User sends progress request */
	//Same as one client case for play, pause, restart, go back, etc.
	it('Should emit progress message down all sockets within group is sent',function(done){
		   var client = io.connect('http://localhost:5000/');
		   let targetValueTest = 50;
		   let progressObjTest = {newProgress: targetValueTest, groupToken: appUser1.groupToken};
		client.on('connect', function(data){
			client.emit('join', appUser1.groupToken);
			
			
      client.emit('progress', progressObjTest);
  });
client.on('progress',function(data){
	data.should.equal(progressObjTest.newProgress);
	client.disconnect();
	done();
});
});
//Same as two client case for play, pause, restart, go back, etc.
/* Test 18 - User sends progress request, make sure message sets sent to separate client */
	it('Should emit progress message down all sockets within group is sent (double check to see if other clients would receive message)',function(done){
		   var client = io.connect('http://localhost:5000/');
		   var client2 = io.connect('http://localhost:5000/');
		   let targetValueTest = 50;
		   let progressObjTest = {newProgress: targetValueTest, groupToken: appUser1.groupToken};
		client.on('connect', function(data){
			client.emit('join', appUser1.groupToken);
		});
		client2.on('connect', function(data){
			client2.emit('join', appUser1.groupToken);
			client.emit('progress', progressObjTest);
  });
client2.on('progress',function(data){
	data.should.equal(progressObjTest.newProgress);
	client.disconnect();
	client2.disconnect();
	done();
});
});
});




