var mapButtons = document.querySelectorAll(".btn-map-select");  // Grab all map buttons
var maplockTeamA = document.querySelector("#teamA-locked-map");

function openServerConnection(){
    // Open a connection
    var myPath = window.location.pathname;
    var stream = new EventSource(myPath + "/sse");

    // grab match_id
    var match_id = myPath.split('/').pop();
    //var connectSID = document.getCookie

    // When a connection is made
    stream.onopen = function () {
      console.log('Opened connection');
    };

    // When a connection could not be made
    stream.onerror = function (event) {
      console.log(event);
    };

    // When data is received
    stream.onmessage = function (event) {
      console.log(event.data);
    };

    // A connection was closed
    stream.onclose = function (code, reason) {
      console.log(code, reason);
    };
    // Listen for newcontent events
    stream.addEventListener('test', function(e) {
      console.log(e.data);
    }, false);
    // Listen for attendance broadcast
    stream.addEventListener('attendance', (e) => {publishAttendanceHandler(e)});
    // Listen for maplock broadcast
    stream.addEventListener('maplock', (e) => {publishMapLockHandler(e)});
    // Close the connection when the window is closed
    window.addEventListener('beforeunload', function() {
      stream.close();
    });
};

// Function to send GET request for attendance
function getAttendance() {
  $.get(window.location.href +'/attendance');
}
/* Function to send POST request for locking in a map */
function postMapLock(mapName) {
  // Sends POST request with map name
  $.post(window.location.href + '/maplock', {maplock: mapName}, (data) => {
    return data.success;
  });
}
// Handler for attendance broadcast
function publishAttendanceHandler(e) {
  var myUserID = readCookie('username');
  var connectedUser = e.data; // Store connected user
  var teamB = sessionStorage.getItem('teamB');
  if (teamB==null){
    // New attendance information, so update data
    // note: this stops the infinite loop of attendance checking
    if (connectedUser != myUserID){
      // Update page (TO DO)
      console.log(connectedUser + " has connected!");
      // Update session data
      sessionStorage.setItem('teamB', connectedUser);
      // send GET request for attendance to let the other user know
      getAttendance();
    }
  }
}
// Handler for maplock broadcast
function publishMapLockHandler(e) {
  var data = JSON.parse(e.data);
  if (broadcastFilter(data)){
    // Source of broadcast was not this user...
    // Notify user
    alert('The following map has been locked by the other team: \n' + data.map);
    // Update page  <---- (TO DO)
  }
}

// Function to filter broadcasts that originated from this user
function broadcastFilter(data){
  var myUserID = readCookie('username');
  var sourceUser = data.user;
  return sourceUser == myUserID ? false: true;
}
function convertMapName(key) {
    // note: not all maps need to be converted
    switch (key) {
        // assault maps
        case "horizon" : return "Horizon Lunar Colony";
        case "anubis" : return "Temple of Anubis";
        case "volskaya" : return "Volskaya Industries";
        // escort maps
        case "route66" : return "Route 66";
        case "watchpoint" : return "Watchpoint: Gibraltar";
        // assault maps
        case "blizzard" : return "Blizzard World";
        case "kings" : return "King's Row";
        // control maps
        case "lijiang" : return "Lijiang Tower";
        default: return key;
    }
}

/* Handler for "Lock In" Button */
function lockInMap() {
    // Check if user selected a map
    if (sessionStorage.getItem('map1')){
        let mapA = sessionStorage.getItem("map1");
        // POST mapA to server
        //let maplocked = postMapLock(mapA);
        $.post(window.location.href + '/maplock', {maplock: mapA}, (data) => {
          if (data.success) {
            // Map was successfully locked...
            alert('Map was successfully locked.');
            disableLockedMapSelection();    // disable button since it is locked out now
            // update map lock button to show selected map
            maplockTeamA.innerHTML = convertMapName(mapA);
            // update lock state
            let mapABadge = document.querySelector("#teamA-header .badge");
            mapABadge.classList.remove("badge-warning");
            mapABadge.classList.add("badge-success");
            mapABadge.innerHTML ="Locked";
          } else {
            // Map is already locked by the other team...
            // Notify the user that the map was already locked
            alert("This map was already locked by the other team.");
          }
        });

    } else {
        document.getElementById("map-select-error").classList.toggle("d-none");
    }
}

function disableLockedMapSelection() {
    var lockedMapButton = document.querySelector("#teamA-locked-map");

    lockedMapButton.removeAttribute("data-toggle");
    lockedMapButton.removeAttribute("data-target");
}

/* Function for reading cookie (SRC = https://www.quirksmode.org/js/cookies.html) */
function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

// SSE (TEST ONLY)
/*
var es = new EventSource("/matchterminal");
es.onmessage = function (event) {
  console.log(event.data);
};
*/

$(document).ready(function(){
    // Clear session memory
    sessionStorage.clear();
    // open SSE connection with server
    openServerConnection();
    // Check in with server
    getAttendance();

    // Assign onclick events to btn-map-select buttons
    $(".btn-map-select").click(function(){
        console.log("You chose " + $(this).attr("value"));

        // Reset state of all map select buttons
        $(".btn-map-select .alpha-bg").removeClass("w3-bottombar w3-border-red");
        // Set state of clicked button to "active"
        $(this).find(".alpha-bg").toggleClass("w3-bottombar w3-border-red");

        // set session map variable
        sessionStorage.setItem('map1',$(this).attr("value"));
    });

});
