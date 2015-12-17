var amqp = require('amqp');

var options = {
    host: 'localhost',
    port: 5672,
};

var connection = amqp.createConnection(options);

connection.on('error', function(e) {
    throw e;
});

connection.on('close', function(e) {
    console.log('connection closed.');
});

connection.on('ready', function() {
  connection.queue('hello_node', {'durable': false}, function(q){
      console.log(" [x] ready 'hello_node'");
      pub();
  });
});

function pub() {
  console.log(" [x] Sent 'Hello World!' to 'hello_node'");
  connection.publish('hello_node', 'Hello World!');
}