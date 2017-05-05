// Utiliser startSearch(nombres, but) pour trouver une solution
// Pas utilisé dans le site web mais peut être utlisé dans la console (CTRL-ALT-I)

"use strict"

var testPair2 = [3, 8]
var testPair3 = [8, 3, 25]
var testPair6 = [8, 3, 25, 100, 10, 4]

// Supprime les doublons dans une array de paires (expl: [1, 2, ...] et [2, 1, ...] sont
// des doublons)
function removeDoublons(xs) {
    var sansDoublons = []

    for (var i = 0; i < xs.length; i++) {
        for (var j = 0; j < xs.length; j++) {
            // On prend la paire dans l'array i
            var xi = xs[i][0]
            var yi = xs[i][1]
            // On prend la paire dans l'array j
            var xj = xs[j][0]
            var yj = xs[j][1]

            // On supprime le doublon
            if (xi === yj && xj === yi) {
                xs.splice(j, 1)
            }
        }
    }

    return xs
}


// Rend toutes les possiblités UNIQUES de paires de nombres (x, y) à partir des nombres
// donnés. Sous la forme d'une array contentant les nombres origniaux, avec les deux
// premiers nbres représentant la paire
function pairs(xs) {
    var paires = []

    // On parcourt les nombres
    for (var i = 0; i < xs.length; i++) {

        // Création d'une array sans xs[i]
        var rest = []
        for (var r = 0; r < xs.length; r++) {
            if (r !== i) {
                rest.push(xs[r])
            }
        }

        // On parcourt la nvelle array puis on ajoute i et j à une array,
        // avec le reste des nombres dans un ordre sans importance
        for (var j = 0; j < rest.length; j++) {
            // On crée une array qui ne contient ni i ni j (suppr j de rest)
            var newRest = []
            for (var r2 = 0; r2 < rest.length; r2++) {
                if (r2 !== j) {
                    newRest.push(rest[r2])
                }
            }

            // On ajoute la paire [i, j, le reste...] à l'array des paires
            paires.push([xs[i], rest[j], ...newRest])
        }
    }

    return removeDoublons(paires)   // Enlève les doublons puis retourne
}


// Donne une array contenant des "tuple" [nouveau_stack, str_operation] où n_stack est la
// nvelle liste de nombres avec le 1er elem étant le résultat de l'operation et str_operation
// le string dénotant l'opération effectuée.
function operations(num_stack) {
    var ops = []

    var x = num_stack[0]            // La première valeur du stack
    var y = num_stack[1]            // La deuxième
    var rest =  num_stack.slice(2)  // Le reste du stack

    var big = Math.max(x, y)        // Pour la division et soustraction
    var small = Math.min(x, y)

    // On ajoute l'addition [stack, "x + y = (x + y)"]
    ops.push([[x + y, ...rest], x + " + " + y + " = " + (x + y)])
    // On ajoute la multiplication [stack, "x * y = (xy)"]
    ops.push([[x * y, ...rest], x + " * " + y + " = " + (x * y)])
    // Si la soustraction est utile (!= 0)
    if (big - small !== 0) {
        // On ajoute la division [stack, "big - small = (b-s)"]
        ops.push([[big - small, ...rest], big + " - " + small + " = " + (big - small)])
    }
    // Si pas de div / 0
    if (small !== 0) {
        // Si div entière possible
        if (big % small === 0) {
            // On ajoute la division [stack, "b / s = (b/s)"]
            ops.push([[Math.floor(big / small), ...rest],
                      big + " / " + small + " = " + (Math.floor(big / small))])
        }
    }

    return ops
}


// Pour chacune des opérations sur le stack, vérifie si le résultat = but, si oui, retourne
// le string de l'opération (sera géré par le niveau en dessus). Sinon, fait les nouvelles
// paires possibles pour le stack de l'opération et récurse sur chacunes des paires. Si le
// niveau d'en dessus trouve qqch, retourne le string retourné collé à son propre string.
function treeSearch(num_stack, but) {
    var ops = operations(num_stack)

    for (var opTuple of ops) {      // Pour chacunes des opérations
        var newStack = opTuple[0]   // Le stack contentant le res de l'op
        var opStr = opTuple[1]      // Le string décrivant l'op

        if (newStack[0] == but) {   // Si l'op a atteint le bon nbre
            return "\n" + opStr
        } else {
            var newPairs = pairs(newStack)      // Génère les nvelles paires pour le nveau stack

            for (var pair of newPairs) {        // Pour chacunes de ces paires
                var result = treeSearch(pair, but)  // On relance la recherche (nvelle branche)

                if (result) {
                    return opStr + result
                }
            }
        }
    }
}


// Démarre la récursion en faisant les étapes préliminaires, comme vérifier si la solution
// est dans l'array. Puis lance la récusion pour chaque paire possible de l'array originale
function startRecurs(num_stack, but) {
    if (num_stack.indexOf(but) > 0) {       // Si but est dans l'array
        return "Solution dans la liste de nombres : " + but
    }

    var newPairs = pairs(num_stack)     // On génère les paires

    for (var pair of newPairs) {        // Pour chaque paire
        var result = treeSearch(pair, but)  // On lance la recherche

        if (result) {                              // Quand trouvé
            return "Résultat trouvé: \n" + result  // On retoure le string assembé par treeSearch
        }
    }
}
