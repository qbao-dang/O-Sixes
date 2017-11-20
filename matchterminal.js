function set_MapLock() {
    // Get the modal
    var modalA = document.getElementById('maplock_ModalA');
    var modalB = document.getElementById('maplock_ModalB');

    // Get the button that opens the modal
    var btnA = document.getElementById("teamA-maplock");
    var btnB = document.getElementById("teamB-maplock");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal 
    btnA.onclick = function() {
        modalA.style.display = "block";
    }
    btnB.onclick = function() {
        modalB.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modalA.style.display = "none";
        modalB.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modalA) {
            modalA.style.display = "none";
        } else if (event.target == modalB) {
            modalB.style.display = "none";
        }
    }
}