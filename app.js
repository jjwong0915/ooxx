'use strict';

//packages
var http = require('http');
var path = require('path');

var express = require('express');
var socketIO = require('socket.io');

//initial server
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

var count = 0, result=0;
var p1 = '', p2 = '', turn = '';
var game = [0,0,0,0,0,0,0,0,0];

//game checker
var checkGame = function() {
	for(var i=0;i<3;i++) {
		if(game[i*3] && game[i*3] == game[i*3+1] && game[i*3+1] == game[i*3+2]) return result = game[i*3];
		if(game[0+i] && game[0+i] == game[3+i] && game[3+i] == game[6+i]) return result = game[0+i];
	}
	if(game[0] && game[0] == game[4] && game[4] == game[8]) return result = game[0];
	if(game[2] && game[2] == game[4] && game[4] == game[6]) return result = game[2];
	return result = 0;
}


//serve web page
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname,'index.html'));
});


io.on('connect', function(socket) {

	count++;
	console.log('count: '+count);

	//initial player
	if(count == 1) {
		p1 = socket.id;
	}

	else if(count == 2) {
		p2 = socket.id;
		game = [0,0,0,0,0,0,0,0,0];
		socket.to(p1).emit('turn',game);
		socket.emit('wait',game);
		turn = p1;
	}

	//press handler
	socket.on('press', function(n) {
		if(socket.id == turn && game[n] == 0) {

			if(socket.id == p1) {
				game[n] = 1;
			} else if(socket.id == p2) {
				game[n] = 2;
			}

			checkGame();
			if(result == 1) {
				socket.emit('win', game);
				socket.to(p2).emit('lose', game);
				return;
			} else if(result == 2) {
				socket.emit('win', game);
				socket.to(p1).emit('lose', game);
				return;
			}

			if(turn == p1) {
				turn = p2;
				socket.to(p2).emit('turn', game);
				socket.emit('wait', game);
			} else if(turn == p2) {
				turn = p1;
				socket.to(p1).emit('turn', game);
				socket.emit('wait', game);
			}

		}
	});

	//finalize
	socket.on('disconnect', function() {
		count--;
		console.log('count: '+count);
	});

});

//start server
server.listen(3000, function() {
	console.log('Server is listen at http://localhost:3000');
});

