// state.js
export let gameState = {
    player: null,
    score: 0,
    solvedPuzzles: [],
    startTime: null,
    timeLimit: 600, // secondes
};

export function resetState() {
    console.debug("[DEBUG] Reset du state");
    gameState = {
        player: null,
        score: 0,
        solvedPuzzles: [],
        startTime: Date.now(),
        timeLimit: 600,
    };
}

export function addScore(points) {
    gameState.score += points;
    console.debug(`[DEBUG] Score ajouté: ${points}, total: ${gameState.score}`);
}

export function solvePuzzle(puzzleId) {
    if (!gameState.solvedPuzzles.includes(puzzleId)) {
        gameState.solvedPuzzles.push(puzzleId);
        console.debug(`[DEBUG] Puzzle résolu: ${puzzleId}`);
    }
}
