var mapButtons = document.querySelectorAll(".btn-map-select");  // Grab all map buttons
var mapA = document.querySelector("#teamA-locked-map");

$(document).ready(function(){
    // Clear session memory
    sessionStorage.clear(); 
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

