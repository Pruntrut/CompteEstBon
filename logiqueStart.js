var nomsJoueurs = ["Joueur 1","Joueur 2"];

var timeout
var t0 = 3000;  // 30s
var t1 = t0;

// Quand clic sur jouer, lance le timer et tire les cartes
function startgame() {
    if($("nom1").value) {
        nomsJoueurs[0] = $("nom1").value
        $("player-name-1").innerHTML = $("nom1").value
    }
    
    if ($("nom2").value) {
        nomsJoueurs[1] = $("nom2").value
        $("player-name-2").innerHTML = $("nom2").value
    }
    
    init()
    quitAccueil()

    timeout = setTimeout(timer, 10)
}

// Timer allant de t0 (en cs) à 0
function timer() {
    if (t1 <= 0) {
        endTimer()          // Dans dessin
    } else {
        t1 -= 1
        var normalized = (t1/t0 * (100 - 3)) + 3; // Entre 3 et 100% (évite l'écrasement)
        var seconds = Math.round(t1/100)
        updateTimer(normalized, seconds)
        timeout = setTimeout(timer, 10)
    }
}

// Arrête le timer et saute direct au prochain écran
function skipTimer() {
    clearTimeout(timeout)
    endTimer()
}
