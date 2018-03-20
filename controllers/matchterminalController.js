var express = require('express');
const fs = require('fs');
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
// GET /matchterminal/:matchid/attendance controller
exports.getAttendance = function (req, res) {
  // Broadcast Attendance
  console.log('Publishing that ' + req.user + ' has connected to '+ req.params.matchid +'...');

  var message = 'event: attendance\nid:  1\n' + 'data: ' + req.user + '\n\n';
  publisherClient.publish((req.params.matchid + "-updates"), message);
  // Send response
  res.status = 200;
  res.send("Attendance acknowledged.");
};
/* GET /:matchid/ban-map controller */
exports.getBanMap = (req, res) => {
  var mapName = req.params.mapName;
  var userName = req.user;
  var checkTurn;
  var banSuccess;
  var banMessage;

  // DUMMY CODE
  console.log('Opening match.json file...');
  fs.readFile('./dummy/match.json', (err, data) => {
    var match = JSON.parse(data);
    console.log("Checking if it is " + userName + "'s turn to ban...");

    // Check if maps have been locked already
    if (match.maps.length >= 2 && match.allMaps.length > 1){
      // Check if its the User's turn to ban
      if (match.banTurn == userName){
        // Confirmed that it is User's turn to ban...
        // Remove banned map from allMaps List
        delete match.allMaps[match.allMaps.indexOf(mapName)];
        match.allMaps.sort();
        match.allMaps.pop();  // remove last element of array, which should be null
        match.banTurn = nextTurn(req.params.matchid, userName);
        // Toggle turn
        var data = JSON.stringify(match, null, 2);
        console.log("Updating match file...");
        fs.writeFile('./dummy/match.json', data, (err) => {
          if (err) next(new Error('Failed to write in file.'));
          console.log('Match file updated successfully.');
        });
        console.log("Informing user that it is their turn...");
        // Publish banned map to "mapban" channel
        console.log('Preparing to publish data to channel...');
        var broadcastData = {map: mapName};
        var message = publishData('mapban', JSON.stringify(broadcastData));
        console.log('Publishing the following message to [' + req.params.matchid + '-updates] channel\n' + message);
        publisherClient.publish((req.params.matchid + '-updates'), message);
        // Send successful response to user
        banSuccess = true;
        banMessage = "Successfully banned " + mapName + "!";
        res.json({success: banSuccess, message: banMessage, code:0});
      } else {
        // Not User's turn to ban...
        console.log("Informing user that it is NOT their turn...");
        banSuccess = false;
        banMessage = "It's not your turn.";
        res.json({success: banSuccess, message: banMessage, code:1});
      }
    } else if (match.allMaps.length == 1) {
        // Map ban complete
        res.json({success:false, message: "Map ban complete!", code:3});
    } else {
      // Players need to lock maps first
      res.json({success: false, message: "One or more teams have not locked a map yet.", code: 2});
    }

  });

};
/* POST /:matchid/maplock controller */
exports.postMapLock = function (req, res, next) {
  // DUMMY CODE
  var maplock = req.body.maplock;
  console.log('Map lock request made: ' + maplock +  '...');
  // Check if map is locked
  // DUMMY CODE
  var maplockCheck;
  // Read match file (TO BE REPLACED WITH MATCH OBJECT)
  console.log('Opening match.json file...');
  fs.readFile('./dummy/match.json', (err, data) => {
      if (err) { console.log(err.message); return new Error('Failed to read file.')}
      var match = JSON.parse(data);
      console.log('Found match object: \n' + match.maps);
        // Check if map is already locked
      console.log('Checking for [' + maplock + '] inside of [maps]...') ;
      if (match.maps.includes(maplock)){
        // Map has been locked already...
        res.json({success: false, message:"Map already locked.  Choose another map."});
      } else {
        // Map has not yet been locked...
        // DUMMY CODE
        // Add map to match
        match.maps.push(maplock);
        // Remove locked map from allMaps List
        delete match.allMaps[match.allMaps.indexOf(maplock)];
        match.allMaps.sort();
        match.allMaps.pop();  // remove last element of array, which should be null
        // Update match file...
        var data = JSON.stringify(match, null, 2);
        // Write match file
        fs.writeFile('./dummy/match.json', data, (err) => {
          if (err) next(new Error('Failed to write in file.'));
          console.log('Maps updated in match file.');
        });
        // Publish map to channel with client-safe user id
        console.log('Preparing to publish data to channel...');
        var broadcastData = {user: req.user, map: maplock}; // Note: replce req.user with client-safe id
        var message = publishData('maplock', JSON.stringify(broadcastData));
        console.log('Publishing the following message to []' + req.params.matchid + "-updates" + '] channel:\n' + message)
        publisherClient.publish((req.params.matchid + "-updates"), message);
        res.json({success: true, message:"Successfully locked " + maplock + "!"});
      }
  });
};
/*
 * CONTROLLER FUNCTIONS FOR SSE
 */
// Controller function for creating the SUBSCRIBER client
exports.setSubscriber = function(req, res) {
  req.socket.setTimeout(900000);

  var messageCount = 0;
  var subscriber = redis.createClient();

  subscriber.subscribe(req.params.matchid + "-updates");

  // In case we encounter an error...print it out to the console
  subscriber.on("error", function(err) {
  console.log("Redis Error: " + err);
  });

  // When we receive a message from the redis connection
  subscriber.on("message", function(channel, message) {
    messageCount++; // Increment our message count
    console.log('Message sending: \n' + message);
    res.write(message); // Note the extra newline
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
// Controller function for firing a test event (DEV USE ONLY - TO BE DELETED)
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
// Function to toggle next turn for a match
nextTurn = function (matchId, user) {
  // DUMMY CODE
  switch(matchId){
    case "wed8pm-123":
      switch(user){
        case "UserA":
          console.log("User has been switched!");
          return "UserB";
        case "UserB":
          console.log("User has been switched!");
          return "UserA";
        default:
          return new Error("User is not assigned to this match.");
      }
    default:
      console.log("Match ID " + matchId + "was not found.  nexTurn toggle failed.");
      return new Error("Match ID does not exist.");
  }
}

// Function to format data into a message format for publication to specific events
publishData = function (eventName, data){
  return 'event: ' + eventName + '\nid: 1\n' + 'data: '+ data + '\n\n';
}
