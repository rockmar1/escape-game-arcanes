// === state.js ===
// Contient l’état global du jeu
export const gameState = {
  playerName: "",
  score: 0,
  puzzlesDone: [],
  timer: null,
  debug: false,
};

export function setPlayerName(name) {
  gameState.playerName = name;
}

export function addScore(points) {
  gameState.score += points;
}

export function resetState() {
  gameState.playerName = "";
  gameState.score = 0;
  gameState.puzzlesDone = [];
  gameState.timer = null;
}

export function toggleDebug() {
  gameState.debug = !gameState.debug;
  console.log("[DBG] Mode debug:", gameState.debug);
}
