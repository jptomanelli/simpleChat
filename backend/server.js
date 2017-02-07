var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use("/public", express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

//Whenever someone connects this gets executed
io.on('connection', function(socket){
  console.log('A user ' + socket.id + ' connected');

  socket.emit('announcement', { message: 'A new user has joined!' });

  socket.on('event', function(data) {
    console.log('A client name is:', data.message);
  });

  socket.on('disconnect', function () {
    console.log('\x1b[36m', 'A user ' + socket.id + ' disconnected', '\x1b[0m');
  });

});


http.listen(3000, function(){
  console.log('listening on *:3000');
});
