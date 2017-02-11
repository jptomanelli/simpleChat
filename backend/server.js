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
    users.push(user);
    ids.push(socket.id);
    //  Populate user list
    io.sockets.emit('users.update', users);
  });
  //  ready
  socket.on('ready', function(user) {
    socket.emit('chat.update', messageHistory);
    console.log('sending messages to ' + user);
  });

  socket.on('chat.message', function(message){
        console.log(socket.id + ' : ' + message);
        io.sockets.emit('chat.message', message);
    });

  //  Disconnect - Not currently working
  //  When a user disconnects they are not removed from user array
  //  Maybe an issue with index or splice ? ?
  socket.on('disconnect', function () {
    var index = ids.indexOf(socket.id);
    if (index > -1) {
      ids.splice(index, 1);
      users.splice(index,1);
      console.log('\x1b[36m', socket.id + ' disconnected', '\x1b[0m');
      io.sockets.emit('users.update', users);
    } else {
      console.log('There has been an error with the userlist');
    }
  });

});


http.listen(3000, function(){
  console.log('listening on *:3000');
});
