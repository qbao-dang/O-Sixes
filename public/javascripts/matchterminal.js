var mapButtons = document.querySelectorAll(".btn-map-select");  // Grab all map buttons
var mapA = document.querySelector("#teamA-locked-map");

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
    // Listen for attendance broadcast on specific stream
    stream.addEventListener(match_id + '-attendance', function(e){
      var connectedUser = e.data; // Store connected user
      if (connectedUser == ) {

      }
    });
    // Close the connection when the window is closed
    window.addEventListener('beforeunload', function() {
      stream.close();
    });
};

// Function to send GET request for attendance
function getAttendance() {
  $.get(window.location.pathname +'/attendance');
}
// Handler for attendance broadcast
function publishAttendanceHandler() {

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

function lockInMap() {
    // Check if user selected a map
    if (sessionStorage.getItem('map1')){
        disableLockedMapSelection();    // disable button since it is locked out now

        // update map lock button to show selected map
        let mapOne = sessionStorage.getItem("map1");
        mapA.innerHTML = convertMapName(mapOne);

        // update lock state
        let mapOneBadge = document.querySelector("#teamA-header .badge");
        mapOneBadge.classList.remove("badge-warning");
        mapOneBadge.classList.add("badge-success");
        mapOneBadge.innerHTML ="Locked";

        // update server with map A selection
        sendMapOne(mapOne);
    } else {
        document.getElementById("map-select-error").classList.toggle("d-none");
    }
}

function disableLockedMapSelection() {
    var lockedMapButton = document.querySelector("#teamA-locked-map");

    lockedMapButton.removeAttribute("data-toggle");
    lockedMapButton.removeAttribute("data-target");
}

function sendMapOne(mapOne) {
    // sends map A selection to server
    console.log("Map 1 (" + mapOne + ") has been sent to the server!");
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
