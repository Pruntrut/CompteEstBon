"use strict"

var cartes                      // Liste des cartes tirées au début
var cible                       // Cible à atteindre
var ciblesEntrees               // Liste des cibles entrees par les joueurs
var rechercheSolution = false
var egalite = false

function init() {
    var cartesDispo = getCartesDispo()
    cartes = choisirCartesAlea(6, cartesDispo)
    opStack = cartes.slice()            // Deep copy l'array nvel objet
                                        // Voir logiqueSolutions.js
    cible = calcCible(100, 1000)

    drawChoisies(cartes)
    drawCible(cible)
    drawOperations()
}


// Crée un tableau avec toutes les cartes disponibles en double
function getCartesDispo() {
    var tabFinal = []

    // Valeurs de 1 à 10
    for (var i = 1; i <= 10; i++) {
        tabFinal.push(i)
        tabFinal.push(i)
    }

    // Valeurs 25, 50, 75 et 100
    var valeurs = [25, 50, 75, 100]

    for (var i = 1; i < valeurs.length; i++) {
        tabFinal.push(valeurs[i])
        tabFinal.push(valeurs[i])
    }

    return tabFinal
}


// Choisit n cartes dans un tableau aléatoirement (sans remise)
function choisirCartesAlea(n, tab) {
    var choisi = []

    while (choisi.length < n) {
        var randIndex = Math.floor(Math.random() * tab.length)  // choisit un index aléa dans le range du tableau
        
        if (!cardInArray(choisi, randIndex)) {                  // si on a pas deja choisi le nombre
            choisi.push([tab[randIndex], randIndex])            // met la carte dans le nouv. tableau
        }
    }
    
    return choisi.map(function(x) {     // On retourne juste les nombres et non les index
        return x[0];
    });
}


function cardInArray(arr, index) {
    console.log("In array:", index, arr)
    
    for (var i = 0; i < arr.length; i++){
        if (arr[i][1] === index) {
            console.log("true")
            return true;
        }
    }
    
    return false;
}


// Choisit un nbre aléa dans [min;max[
function calcCible(min, max) {
    return Math.floor(Math.random() * (max - min) + min)        // Nbre entre 0 et 1 * plage "ajustée" à 0 + on réajuste
}


// Prend les deux cibles entrées, les compare et retourne 0 si gauche est plus près, 1 si c'est
// droite, 2 s'il y a égalité et 3 s'il y a une erreur dans l'input
function checkCibles(cible) {
    var j1 = parseInt($("cibleJ1").value)
    var j2 = parseInt($("cibleJ2").value)

    if (isNaN(j1)) {
        alert(nomsJoueurs[0] + ", la valeur que vous avez entré n'est pas un entier")
        clearInput()
        return 3
    } else if (isNaN(j2)) {
        alert(nomsJoueurs[1] + ", la valeur que vous avez entré n'est pas un entier")
        clearInput()
        return 3
    } else {
        ciblesEntrees = [j1, j2]

        if (Math.abs(cible - j1) === Math.abs(cible - j2)) {                // Egalité
            return 2
        } else if (Math.abs(cible - j1) < Math.abs(cible - j2)){            // P1 plus proche
            return 0
        } else {                                                            // P2 plus proche
            return 1
        }
    }
}


// Gère les cibles entrées par les joueurs et lance le nouvel écran
function handleCibles() {
    var winner = checkCibles(cible)

    switch (winner) {
        case 0:
            rechercheSolution = true
            joueurActuel = 0
            enterSolution(nomsJoueurs[0])
            break;
        case 1:
            rechercheSolution = true
            joueurActuel = 1
            enterSolution(nomsJoueurs[1])

            break;
        case 2:
            rechercheSolution = true
            egalite = true
            joueurActuel = 0
            enterSolution(nomsJoueurs[0])

            break;
    }
}
