//const fs = require('fs');
const http = require('http');
//const https = require('https');

//const privateKey = fs.readFileSync('sslcert/server.key', 'utf8');
//const certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

//const credentials = {key : privateKey, cert : certificate};
const express = require('express');
const app = express();

const httpServer = http.createServer(app);
//const httpsServer = https.createServer(credentials, app);

const io = require('socket.io')(httpServer);
//const io = require('socket.io')(httpsServer);

const Room = require('./models/room.js');
const uuid = require('uuid-js');

app.use("/public", express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.status(200)
    .sendFile(__dirname + '/views/index.html');
});

app.get('*', function(req, res) {
  res.status(404)
    .send('Not found');
});

function checkForRoom(obj, room) {
	for (key in obj) {
		if (key == room) {
			return true;
		}
	}
	return false;
}

//  Should store in DB
var messageHistory = [];
var users = [];
var ids = [];

var people = {};
var rooms = {};

//  On connection (all socket.io code)
io.on('connection', function(socket) {
	//  Print socket id
	console.log('A user ' + socket.id + ' connected');
  io.sockets.connected[socket.id].emit('announcement', {message : "Welcome!"});
	//  When user picks a username - send data to front
	socket.on('join', function(data) {
		console.log(socket.id + ' set his username to ' + data.name);
		if (!checkForRoom(rooms, data.room)) {
			var tmpID = uuid.create().toString();
			rooms[data.room] = new Room(data.room, tmpID, data.name);
			rooms[data.room].addUser(data.name);
			console.log(rooms[data.room]);
		} else {
			rooms[data.room].addUser(data.name);
			console.log(rooms[data.room]);
		}
		socket.join(data.room);
		/*
		people[socket.id] = {
			"name": user.name,
			"room": user.room
		};
		*/
		users.push(data.name);
		ids.push(socket.id);
		//  Populate user list
		io.sockets.in(data.room).emit('users.update', rooms[data.room].getUsers());
		//console.log(people);
	});
	//  ready
	socket.on('ready', function(data) {
		socket.emit('chat.update', rooms[data.room].getMessages());
		console.log('sending messages to ' + data.user);
	});

	//  Message
	socket.on('chat.message', function(data) {
		console.log(data.name + ' : ' + data.message);
		io.sockets.in(data.room).emit('chat.message', data);
		//io.sockets.emit('chat.message', data);
		messageHistory.push(data);
		rooms[data.room].addMessage(data);
		data = null;
	});


});


httpServer.listen(8080, function(){
  console.log('http listening on 8080');
});
/*
httpsServer.listen(8443, function(){
  console.log('http listening on 8443');
});
*/
