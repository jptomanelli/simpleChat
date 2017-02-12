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

app.use("/public", express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

//  Should store in DB
var messageHistory = [];
var users = [];
var ids = [];

//  On connection (all socket.io code)
io.on('connection', function(socket){
  //  Print socket id
  console.log('A user ' + socket.id + ' connected');
  //  When user picks a username - send data to front
  socket.on('join', function(user) {
    console.log(socket.id + ' set his username to ' + user);
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

  //  Message
  socket.on('chat.message', function(message){
        console.log(socket.id + ' : ' + message);
        io.sockets.emit('chat.message', message);
        messageHistory.push(message);
        message = "";
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


httpServer.listen(8080, function(){
  console.log('http listening on 8080');
});
/*
httpsServer.listen(8443, function(){
  console.log('http listening on 8443');
});
*/
