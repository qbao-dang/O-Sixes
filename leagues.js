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
    /* Function: read xml file */
    var name, time, teamSpots, indivSpots, i, k, xmlDoc; 
    var leagueNames, leagueTimes, leagueIndivSpots, leagueTeamSpots;
    var leagueDays;
    var days = ["SAT","SUN"];
    
    xmlDoc = xml.responseXML;
    leagueDays = xmlDoc.getElementsByTagName("day");
    
    for (k=0;k<leagueDays.length;k++){
        /* Loop through each league day */
        name = leagueDays[k].getElementsByTagName("title");
        time = leagueDays[k].getElementsByTagName("time");
        teamSpots = leagueDays[k].getElementsByTagName("team-spots");
        indivSpots = leagueDays[k].getElementsByTagName("indiv-spots");
        
        leagueNames = document.getElementById(days[k]).getElementsByClassName("league-name");
        leagueTimes = document.getElementById(days[k]).getElementsByClassName("league-time");
        leagueIndivSpots = document.getElementById(days[k]).getElementsByClassName("indiv-spots");
        leagueTeamSpots = document.getElementById(days[k]).getElementsByClassName("team-spots");
        for (i=0; i<name.length;i++){
            if (i<leagueNames.length){
                leagueNames[i].innerHTML = name[i].childNodes[0].nodeValue;
                leagueTimes[i].innerHTML = time[i].childNodes[0].nodeValue;
                leagueIndivSpots[i].innerHTML = indivSpots[i].childNodes[0].nodeValue;
                leagueTeamSpots[i].innerHTML = teamSpots[i].childNodes[0].nodeValue;
            }
        }
    }

    

}