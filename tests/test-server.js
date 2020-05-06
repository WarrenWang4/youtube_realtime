var should = require('should');
var io = require('socket.io-client');
var mocha = require('mocha')
  var describe = mocha.describe
  var it = mocha.it


let appUser1 = {'name':'Jack', 'groupToken':'1111111111111'};
describe("Server",function(){
	/* Test 1 - New user */
	it('Should emit new user once they connect',function(done){
    var client = io.connect('http://localhost:5000/');
    client.emit('create', appUser1.groupToken);
      client.emit('enterChat', {
      message: appUser1.name + " has entered the chat",
      groupToken: appUser1.groupToken
  });

client.on('enterChat',function(data){
      data.should.be.type('string');
      data.should.equal(appUser1.name + " has entered the chat");
      /* If this client doesn't disconnect it will interfere 
      with the next test */
      client.disconnect();
      done(); 
    });
});


	/* Test 2 - User sends play request*/
	it('Should emit play message down all sockets within group if request is sent (including sender socket)',function(done){
		   var client = io.connect('http://localhost:5000/');

		client.on('connect', function(data){
			client.emit('join', appUser1.groupToken);
			client.emit('play', appUser1.groupToken);
  });
client.on('play',function(data){
	client.disconnect();
	done();
});
});
	/* Test 3 - User sends play request, make sure message sets sent to separate client */
	it('Should emit play message down all sockets within group if request is sent (double check to see if other clients would receive message)',function(done){
		   var client = io.connect('http://localhost:5000/');
		   var client2 = io.connect('http://localhost:5000/');
		client.on('connect', function(data){
			client.emit('join', appUser1.groupToken);
		});
		client2.on('connect', function(data){
			client2.emit('join', appUser1.groupToken);
			client.emit('play', appUser1.groupToken);
  });
client2.on('play',function(data){
	client.disconnect();
	client2.disconnect();
	done();
});
});

	/* Test 4 - User sends pause request */
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
	it('Should emit goback message down all sockets within group is sent',function(done){
		   var client = io.connect('http://localhost:5000/');
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
	it('Should emit goforward message down all sockets within group is sent',function(done){
		   var client = io.connect('http://localhost:5000/');
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




