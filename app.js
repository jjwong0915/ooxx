'use strict';

var http = require('http');
var path = require('path');
var express = require('express');
var socketIO = require('socket.io');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var count = 0;
var p1 = 0, p2 = 0;
var game = [0,0,0,0,0,0,0,0,0];

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname,'index.html'));
});

io.on('connect', function(socket) {
	count++;
	console.log('count: '+count);
	if(count == 1) {
		p1 = socket.id;
	} else if(count == 2) {
		p2 = socket.id;
		game = [0,0,0,0,0,0,0,0,0];
		socket.to(p1).emit('turn',game);
		socket.emit('wait',game);
	}
	socket.on('press', function(n) {
		if(socket.id == p1) {
			console.log('event: p1 press '+ n);
		} else if(socket.id == p2) {
			console.log('event: p2 press '+ n);
		}
	})
	socket.on('disconnect', function() {
		count--;
		console.log('count: '+count);
	});
});

server.listen(3000, function() {
	console.log('Server is listen at http://localhost:3000');
});

