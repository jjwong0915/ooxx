'use strict';

var path = require('path');
var express = require('express');
var socketIO = require('socket.io');

var app = express.createServer();
var io = socketIO(app);
var count = 0;

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname,'index.html'));
});

io.on('connection', function(socket) {
	count++;
	if(count == 2) {
		io.emit('start');
	}
	socket.on('disconnect', function() {
		count--;
	});
});

server.listen(3000);