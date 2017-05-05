// Termine la partie, si égalité, regarder le nombre d'étapes nécessaires et détermine le vainqueur
function endGame() {
    rechercheSolution = false;

    console.log("Fin du jeu: ", solutions)

    if (solutions.length === 2) {
        var p1 = solutions[0]
        var p2 = solutions[1]

        if (p1.steps === p2.steps) {
            victoryScreen(solutions)
        } else if (p2.steps < p1.steps) {
            victoryScreen([solutions[1]])
        } else {
            victoryScreen([solutions[0]])
        }
    } else if (solutions.length === 0){     // Personne n'a trouvé
        victoryScreen([])
    } else {
        victoryScreen(solutions)
    }
}
