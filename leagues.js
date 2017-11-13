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
    var x, y, i, j, txt, xmlDoc; 
    xmlDoc = xml.responseXML;
    txt = "";
    x = xmlDoc.getElementsByTagName("title");
    for (i=0; i<x.length;i++){
        txt = x[i].childNodes[0].nodeValue;
        
        document.getElementsByClassName("league-name")[i].innerHTML = txt;
    }
    
    /* Load times */
    txt = "";
    y = xmlDoc.getElementsByTagName("time");
    for (j=0; j<y.length;j++){
        txt = y[j].childNodes[0].nodeValue;
        document.getElementsByClassName("league-time")[j].innerHTML = txt;
    }

}