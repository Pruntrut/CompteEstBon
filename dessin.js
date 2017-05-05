"use strict"

// Retourne un élément HTML selon son id
function $(id) {
    return document.getElementById(id)
}


// Retourne un tableau d'éléments HTML avec une certaine classe CSS
function cls(clsse) {
    return document.getElementsByClassName(clsse)
}

// Ferme la page d'accueil et ouvre la page des cibles et des cartes
function quitAccueil() {
    $("accueil").style.display = "none"
    $("common").style.display = "flex"
    $("timer-container").style.display = "flex"
}

// Affiche la barre de chargement selon une valeur entre 100 et 0
function updateTimer(n, s) {
    $("progress").style.width = n + "%";
    $("seconds").innerHTML = s;
}

// Cache la div timer
function endTimer() {
    $("timer-container").style.display = "none"
    $("player-container").style.display = "flex"
}

// Dessine un tableau HTML à partir d'une array de cartes
function drawChoisies(tab) {
    var str = '<table id="tabCartes"><tr>'

    for (var i = 0; i < tab.length; i++) {
        str += '<td id="C' + i + '" onclick="appuiCase(' + i + ',' + tab[i] + ')">' + tab[i] + "</td>"
    }

    str += "</tr></table>"

    $("divTabCartes").innerHTML = str
}

// Dessine le tableau des opérations
function drawOperations() {
    var tab = ["+", "*", "-", "/"];
    var symboles = ["+", "&times;", "-", "&divide;"]
    var str = '<table id="tabOps"><tr>'

    for (var i = 0; i < tab.length; i++) {
        str += '<td class="op-cell" id="O' + i +
                 '" onmousedown="appuiOp(' + i + ',\'' + tab[i] + '\')"' +
                 'onmouseup="drawOpRelease('+ i +')">' + symboles[i] + "</td>"
    }

    str += "</tr></table>"

    $("operations-container").innerHTML = str
}

// Dessine la cible à atteindre
function drawCible(cible) {
    $("cible").innerHTML = "<div>Cible</div><div class='cible-text'>" + cible + "</div>"
}

// Vide les inputs s'ils sont invalides
function clearInput() {
    $("cibleJ1").value = ""
    $("cibleJ2").value = ""
}

// Passe de la vue "input" à la vue entrée de calcul
function enterSolution(winnerStr) {
    $("player-container").style.display = "none"
    $("solution-container").style.display = "flex"

    $("solution-joueur").innerHTML = winnerStr
}

// Change la couleur de la case pressée
function drawCasePress(cibleNo) {
    var cibleStr = "C" + cibleNo

    $(cibleStr).style.backgroundColor = "#c9a0ad";
    $(cibleStr).style.boxShadow = "inset 0px 0px 10px 1px rgba(0,0,0,0.50)";
}

// Change la couleur de l'opération pressée
function drawOpPress(opNo) {
    console.log("Press", "O" + opNo)

    var idStr = "O" + opNo
    $(idStr).style.backgroundColor = "#c9a0ad";
    $(idStr).style.boxShadow = "inset 0px 0px 10px 1px rgba(0,0,0,0.50)";
}

// Remet la case à la bonne couleur
function drawOpRelease(opNo) {
    console.log("Release", "O" + opNo)

    var idStr = "O" + opNo
    $(idStr).style.backgroundColor = "#e8d5db"
    $(idStr).style.boxShadow = "";
}

// Met à jour le calcul actuel
function updateCurrentOp() {
    $("current-op").innerHTML = currentOpStr
}

// Met à jour l'historique du calcul
function updateOpStr() {
    $("solution").innerHTML = opStr
}

// Passe de la vue "entrée de calcul" à l'ecran de victoire
function victoryScreen(sols) {
    console.log("Ecran de victoire :", sols)

    drawChoisies(cartes); // On dessine les cartes du début

    if (sols[0]) {         // S'il y a au moins une sol
        var finVal = sols[0].finalValue
        var player = sols[0].joueur
        var op = sols[0].opStr
        var steps = sols[0].steps
    }

    $("solution-container").style.display = "none"
    $("victory-container").style.display = "flex"

    if (sols.length === 2) {            // Egalité
        $("personne").style.display = "none"
        $("draw").style.display = "block"
        $("one-victor").style.display = "none"
        $("draw-msg").style.display = "inline"
        $("ov-msg").style.display = "none"
        $("draw-pronoun").style.display = "inline"
        $("ov-pronoun").style.display = "none"

        var finalOpStr = formatOpStr([op, sols[1].opStr])
    } else if (sols.length === 0) {   // Pas de solutions
        $("personne").style.display = "flex"
        $("un-vainqueur").style.display = "none"
    } else {                        // Une solution
        $("personne").style.display = "none"
        $("draw").style.display = "none"
        $("one-victor").style.display = "block"
        $("draw-msg").style.display = "none"
        $("ov-msg").style.display = "inline"
        $("draw-pronoun").style.display = "none"
        $("ov-pronoun").style.display = "inline"

        var finalOpStr = formatOpStr([op])
    }

    $("victor").innerHTML = nomsJoueurs[player]
    $("target").innerHTML = finVal
    $("steps").innerHTML = steps
    $("opstr-container").innerHTML = finalOpStr
}

// Formatte la solution pour qu'elle s'affiche joliment
function formatOpStr(ops) {
    if (ops.length === 2) {
        var op1 = checkOpStr(ops[0])
        var op2 = checkOpStr(ops[1])

        return "<div class='endgame-solution'>"+nomsJoueurs[0]+" :<br>" + op1 +
               "</div><div class='endgame-solution endgame-solution-padding'>"+ nomsJoueurs[1] + " : <br>" +
                op2 + "</div>"
    } else {
        return "<div class='endgame-solution'>" + checkOpStr(ops[0]) + '</div>'
    }
}

// Vérifie si la solution était d'appuyer sur la bonne case
function checkOpStr(op) {
    if (op === "") {
        return "Appuyé directement sur la bonne case"
    } else {
        return op
    }
}
