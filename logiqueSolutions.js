"use strict"

var joueurActuel
var opStr = ""                  // String qui contient la solution effectuée
var opStack = []                // Array contentant les nombres encore disponibles
var currentOp = []              // Calcul actuel
var currentOpStr = ""           // String qui contient le calcul actuel
var steps = 0
var lastResult = "rien"
var solutions = []
var nombreDeJoueurs = 0;

// Callback lorsque on appuie sur une case des nombres
function appuiCase(index, valeur) {
    console.log("Appui case : ", index, valeur)

    // On n'est pas encore à l'ecran d'entree des solutions
    if (typeof joueurActuel === "undefined") {
        return
    }

    if (valeur === ciblesEntrees[joueurActuel] && rechercheSolution) {   // S'il a cliqué sur la solution
        drawCasePress(index)

        var stop = confirm("La case sur laquelle vous avez cliqué correspond à votre " +
                              "cible, voulez vous vous arrêter là ?")
        if (stop) {
            lastResult = valeur
            opFinished()
            return  // On arrete ici
        }
    }

    // On entre le deuxieme nombre et ce n'est pas deux fois la même case
    if (currentOp.length === 2 && currentOp.indexOf(index) === -1 &&
        rechercheSolution) {
        drawCasePress(index)                        // On colore la cible

        currentOp.push(index)                       // On ajoute l'elément au calcul
        currentOpStr += valeur + " "                // On ajoute la valeur au string

        calcCurrentOp()                             // On calcule le résultat de l'op
        updateCurrentOp()                           // On MAJ le string du calcul actuel
    } else if (rechercheSolution &&                 // On est entré dans l'écran solutions
               currentOp.length !== 1 &&            // On n'entre pas l'opérateur
               currentOp.length < 3 &&              // chiffre + op + chiffre
               currentOp.indexOf(index) === -1) {   // Pas deux fois la même case

        drawCasePress(index)                        // On colore la cible

        currentOp.push(index)                       // On ajoute l'elément
        currentOpStr += valeur + " "                // On ajoute la valeur au string

        updateCurrentOp()                           // On MAJ le string du calcul actuel
    }
}


// Callback lorsque on appuie sur une case des operations
function appuiOp(index, valeur) {
    console.log("Appui op:", index, valeur)

    // Si on a entré le 1er chiffre
    if (rechercheSolution && currentOp.length === 1) {
        drawOpPress(index)
        currentOp.push(valeur)

        if (valeur == "/") {
            currentOpStr += "&divide;" + " "
        } else if (valeur == "*") {
            currentOpStr += "&times;" + " "
        } else {
            currentOpStr += valeur + " "
        }

        updateCurrentOp()
    }
}

// Verifie les divisions/soustractions de l'opération actuelle
function validateCurrentOp(x, op, y) {
    console.log("Valide op:", x, op, y)

    switch (op) {
        case "-":
            if (opStack[x] < opStack[y]) {
                alert("Soustraction impossible !")
                return false
            }
            break
        case "/":
            if (opStack[x] % opStack[y] !== 0)  {
                alert("Seule la division entière est permise!")
                return false
            } else if (opStack[y] === 0) {
                alert("Division par 0 !")
                return false
            }

            break
    }

    return true
}

// Calcule le résultat de l'opération actuelle, si on a atteint la cible, termine la partie
function calcCurrentOp() {
    console.log("Calcul Op:", currentOp)


    var x = currentOp[0]
    var op = currentOp[1]
    var y = currentOp[2]

    var res = eval(opStack[x] + op + opStack[y])

    if (validateCurrentOp(x, op, y)) {
        var len = opStack.length
        var temp = []

        for (var i = 0; i < len; i++) {
            if (i == x || i == y) {
            } else {
                temp.push(opStack[i])
            }
        }
        temp.push(res)
        opStack = temp

        currentOp = []
        opStr += currentOpStr + "= " + res + "<br>"
        lastResult = res
        steps += 1

        updateOpStr()
    }

    drawChoisies(opStack)
    currentOp = []
    currentOpStr = ""

    // S'il reste une carte ou on a atteint la cible, finir la partie
    if (opStack.length === 1 || res === ciblesEntrees[joueurActuel]) {
        opFinished()
    }
}

// Se declenche si l'utilisateur a appuyé sur le btn "suivant", si on a atteint la cible
// ou s'il ne reste qu'une carte. Verifie si le resultat est juste.
function opFinished() {
    console.log("Op finie:", lastResult, steps)

    if (lastResult === "rien") {    // Rien fait
        alert("Vous abandonnez si vite ? Faites un effort...")
    } else if (ciblesEntrees[joueurActuel] !== lastResult) {   // Si on n'a pas atteint la cible      
        alert('Votre cible était : ' + ciblesEntrees[joueurActuel] + " \n" +
              "Vous avez atteint : " + lastResult)

        nextPlayer()
    } else if (egalite && ciblesEntrees[joueurActuel] === lastResult) { // on a atteint la cible et egalité -> joueur suivant
        alert("Le compte est bon !\n" +
              "Vous avez atteint " + ciblesEntrees[joueurActuel] +" en " + steps + " étape(s).\n")

        solutions.push(new Solution(joueurActuel, steps, lastResult, opStr))

        nextPlayer()

    } else { // ON a atteint la cible, -> ecran de victoire
        alert("Le compte est bon !\n" +
              "Vous avez atteint " + ciblesEntrees[joueurActuel] +" en " + steps + " étape(s).");

        solutions.push(new Solution(joueurActuel, steps, lastResult, opStr))

        endGame()
    }
}


// Decide que faire après qu'un joueur ait terminé: changer de joueur
// ou aller à l'ecran de victoire
function nextPlayer() {
    console.log("Joueur suivant:", (joueurActuel + 1) % 2, "nbre:", nombreDeJoueurs, solutions)

    if (solutions.length <= 1 && nombreDeJoueurs > 0) {
        endGame()
    } else if (solutions.length === 2) {
        endGame()
    } else {
        joueurActuel = (joueurActuel + 1) % 2
        nombreDeJoueurs += 1
        resetBoard()

        alert("C'est maintenant au tour de " + nomsJoueurs[joueurActuel])
    }
}

// Remet l'entree de solution à zéro pour nveau joueur
function resetBoard() {
    console.log("Reset de l'entree de solution")

    opStack = cartes.slice()
    opStr = ""
    currentOp = []
    currentOpStr = ""
    steps = 0
    lastResult = "rien"

    updateOpStr()
    updateCurrentOp()
    drawChoisies(opStack)

    enterSolution(nomsJoueurs[joueurActuel])
}

// Efface l'operation actuelle
function effacerCalc() {
    console.log("Efface calc", currentOp)

    currentOpStr = ""
    currentOp = []

    updateCurrentOp()
    drawChoisies(opStack)
}

// Object donné à la fin de l'entrée de sol, représente l'etat final d'une solution.
function Solution(j, s, f, str) {
    this.joueur = j
    this.steps = s,
    this.finalValue = f
    this.opStr = str
}
