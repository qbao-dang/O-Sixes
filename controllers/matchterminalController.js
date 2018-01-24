var express = require('express');

var redis = require('redis'),
    publisherClient = redis.createClient();


/*
 * CONTROLLER FUNCTIONS FOR HANDLING ROUTES
 */
 // GET /matchterminal controller
exports.getMatchTerminal = function(req, res) {
  // Determine MATCH ID
  var match_id = grabMatchId(req.params.user);
  // Determine team of user

  // Check if user is the team captain

  // Package necessary data for match terminal

  // send user to specific match terminal
  res.redirect('/match_id');
};
// GET /matchterminal/:match_id controller
exports.getSpecificMatchTerminal = function (req, res) {
  // Prepare data for view

  // Render view
};

/*
 * CONTROLLER FUNCTIONS FOR SSE
 */
// Controller function for creating the SUBSCRIBER client
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
// Controller function for firing a test event (DEV USE ONLY)
exports.fireEvent = function(req, res, next) {
  publisherClient.publish( 'updates', ('"' + req.params.event_name + '" page visited') );
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('All clients have received "' + req.params.event_name + '"');
  res.end();
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
/*
 * LOCAL FUNCTIONS FOR CONTROLLER FUNCTIONS
 */
// Function to grab match_id based on user_id
grabMatchId = function (user_id) {
  // DUMMY CODE
};
// Function to grab team_id based on user_id
grabTeamId = function(user_id) {
  // DUMMY CODE
};
// Function to check if user is team captain of team
isCaptain = function(username, team_id){
  // DUMMY CODE

};
