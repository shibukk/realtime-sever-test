var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8080;
var amqp = require('amqp');
var amqpConn = amqp.createConnection({host: 'localhost', port: 5672});

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
  socket.on('login', function (data) {
    socket.broadcast.emit('login', {
      id: data.id
    });
  });
  socket.on('move', function (data) {
    socket.broadcast.emit('move', {
      x: data.x,
      y: data.y,
    });
  });
  socket.on('on', function (data) {
    console.log('相手にぶつかりました');
    amqpConn.publish('node_action', {id: data.id, damage: 1});
  });
  socket.on('disconnect', function(){});
});

amqpConn.on('error', function(e) {
    throw e;
});

amqpConn.on('close', function(e) {
    console.log('RabbitMQ connection closed.');
});

amqpConn.on('ready', function() {
  amqpConn.queue('node_action', {'durable': false}, function(q){
    console.log("RabbitMQ ready 'node_action'");
  });
});
