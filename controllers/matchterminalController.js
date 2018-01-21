var express = require('express');

var redis = require('redis'),
    publisherClient = redis.createClient();


// Middleware for server-sent events
exports.sse = function(req, res, next){
  var message_count;
  req.socket.setTimeout(0);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  message_count = 0;
  res.json = function(obj, type){
    res.write("id: " + message_count + "\n");

    // Assign event type in resonse
    if('string' === typeof type) {
      res.write("event: " + type + "\n");
    }
    // Store passed data
    res.write("data: " + JSON.stringify(obj) + "\n\n");
    message_count += 1;
  };
  next();
};

// Run broadcast (SSE TEST ONLY)
exports.broadcastTest = function (req, res, next) {

  var json = JSON.stringify({ message: 'Connection is still open!' });
  res.json(json);
  console.log('Sent: ' + json);

  next();
};

exports.getMatchTerminal = function(req, res) {
  res.render('matchterminal');
};

exports.createStream = function(req,res){
  //send headers for event-stream connection
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.write('\n');
};

exports.setSubscriber = function(req, res) {
  req.socket.setTimeout(900000);

  var messageCount = 0;
  var subscriber = redis.createClient();

  subscriber.subscribe("updates");

  // In case we encounter an error...print it out to the console
  subscriber.on("error", function(err) {
  console.log("Redis Error: " + err);
  });

  // When we receive a message from the redis connection
  subscriber.on("message", function(channel, message) {
    messageCount++; // Increment our message count

    res.write('id: ' + messageCount + '\n');
    res.write("data: " + message + '\n\n'); // Note the extra newline
  });

  //send headers for event-stream connection
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.write('\n');

  // The 'close' event is fired when a user closes their browser window.
  // In that situation we want to make sure our redis channel subscription
  // is properly shut down to prevent memory leaks...and incorrect subscriber
  // counts to the channel.
  req.on("close", function() {
    subscriber.unsubscribe();
    subscriber.quit();
  });
};

exports.fireEvent = function(req, res, next) {
  publisherClient.publish( 'updates', ('"' + req.params.event_name + '" page visited') );
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('All clients have received "' + req.params.event_name + '"');
  res.end();
};
