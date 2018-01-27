var express = require('express');

var redis = require('redis'),
    publisherClient = redis.createClient();

/*
 * MIDDLEWARE
 */
// Function sets up user data for view to use
exports.setViewerData = function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
};

/*
 * CONTROLLER FUNCTIONS FOR HANDLING ROUTES
 */
 // GET /matchterminal controller
exports.getMatchTerminal = function(req, res) {
  // Determine MATCH ID
  var match_id = grabMatchId(req.user);
  // send user to specific match terminal
  res.redirect('/matchterminal/'+ match_id);
};
// GET /matchterminal/:match_id controller
exports.getSpecificMatchTerminal = function (req, res) {
  // Determine team of user
  var  myTeam = grabTeamId(req.user);
  // Determine opposing team
  var enemyTeam = grabEnemyTeamId(req.params.matchid, myTeam);
  // Check if user is the team captain
  var captainCheck = isCaptain(req.user, myTeam);
  // Prepare data for view

  // Render view
  res.render('matchterminal', {teamA: myTeam, teamB: enemyTeam});
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
// Function to grab match_id based on username
grabMatchId = function (username) {
  // DUMMY CODE
  switch (username) {
    case "UserA":
      return "wed8pm-123";
      break;
    case "UserB":
      return "wed8pm-123";
      break;
    case "UserC":
      return "wed9pm-43223";
      break;
    default:
      return new Error("No match found for user " + username)
  }
};
// Function to grab team_id based on username
grabTeamId = function(username) {
  // DUMMY CODE
  switch (username) {
    case "UserA":
      return "Astros";
      break;
    case "UserB":
      return "Bashers";
      break;
    case "UserC":
      return "Crashers";
      break;
    default:
      return new Error("No team found.")
  }
};
// Function to grab enemy team_id based on username
grabEnemyTeamId = function(matchId, myTeam){
  // DUMMY CODE
  var teams = grabTeams(matchId);
  // Determine which team user is on
  if (teams[0] == myTeam ){
    // Enemy team is the other team
    return teams[1];
  } else {
    return teams[0];
  }
}
// Function to check if user is team captain of team
isCaptain = function (username, team_id){
  // DUMMY CODE
  var teamCaptain = grabTeamCaptain(team_id);

  if (teamCaptain == username){
    return true;
  } else {
    return false;
  }
};
// Function to grab team captain
grabTeamCaptain = function (team_id) {
  switch (team_id) {
    case "Astros":
      return "UserA";
      break;
    case "Bashers":
      return "UserB";
      break;
    case "Crashers":
      return "UserC";
      break;
    default:
      return new Error("Team does not exist.")
    }
}

grabTeams = function (matchId) {
  // DUMMY CODE
  switch(matchId){
    case "wed8pm-123":
      return ["Astros", "Bashers"];
    case "wed9pm-43223":
      return ["Crashers", "Dashers"];
    default:
      return new error("Match ID does not exist.");
  }
}
