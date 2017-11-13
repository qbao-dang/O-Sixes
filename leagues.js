var accordionSetup = function(){
    /* Function sets up the accordion behaviour for the league buttons. */
    var acc = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < acc.length; i++) {
        acc[i].onclick = function(){
            /* Toggle between adding and removing the "active" class,
            to highlight the button that controls the panel */
            this.classList.toggle("active");

            /* Toggle between hiding and showing the active panel */
            var panel = this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        }
    }
    
}

var loadLeagueData = function() {
    /* Function will load the schedule data for each league (start time and available spots)*/
    
    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            readLeagueData(this);
        }
    };
    xhttp.open("GET", "leagues.xml", true);
    xhttp.send();
}

var  readLeagueData = function(xml) {
    /* Read xml file */
    var x, y, z, i, xmlDoc; 
    var leagueNames, leagueTimes, leagueSpots;
    xmlDoc = xml.responseXML;
    x = xmlDoc.getElementsByTagName("title");
    y = xmlDoc.getElementsByTagName("time");
    z = xmlDoc.getElementsByTagName("spots");
    leagueNames = document.getElementsByClassName("league-name");
    leagueTimes = document.getElementsByClassName("league-time");
    leagueSpots = document.getElementsByClassName("league-spots");
    for (i=0; i<x.length;i++){
        if (i<leagueNames.length){
            leagueNames[i].innerHTML = x[i].childNodes[0].nodeValue;
            leagueTimes[i].innerHTML = y[i].childNodes[0].nodeValue;
            leagueSpots[i].innerHTML = z[i].childNodes[0].nodeValue;
        }
    }
}