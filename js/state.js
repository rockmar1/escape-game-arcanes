// state.js
export let gameState = {
    player: "",
    score: 0,
    timeLeft: 300, // 5 minutes
    solvedPuzzles: [],
    victory: false
};

export function resetGame() {
    gameState = {
        player: gameState.player, // on garde le pseudo
        score: 0,
        timeLeft: 300,
        solvedPuzzles: [],
        victory: false
    };
    console.debug("[DEBUG] GameState reset:", gameState);
}

export function setPlayerName(name) {
    gameState.player = name;
    console.debug("[DEBUG] Joueur défini :", name);
}
