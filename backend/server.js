const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use("/public", express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

io.on('connection', function(socket){

  console.log('A user ' + socket.id + ' connected');

  socket.on('join', function(user) {
    console.log(socket.id + ' set his username to ' + user);
    io.sockets.emit('user.add', user);
  });

  socket.on('chat.message', function(message){
        console.log(socket.id + ' : ' + message);
        io.sockets.emit('chat.message', message);
    });

  socket.on('disconnect', function () {
    console.log('\x1b[36m', socket.id + ' disconnected', '\x1b[0m');
    io.sockets.emit('user.remove', socket.id);
  });

});


http.listen(3000, function(){
  console.log('listening on *:3000');
});
