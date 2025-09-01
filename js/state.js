let state = {
  playerName: "",
  score: 0,
  debug: false
};

// === Gestion joueur ===
export function setPlayerName(name) {
  state.playerName = name;
  const hudPlayer = document.getElementById("hud-player");
  if (hudPlayer) hudPlayer.textContent = `👤 ${name}`;
}
export function getPlayerName() {
  return state.playerName;
}

// === Score ===
export function setScore(value) {
  state.score = value;
  const scoreEl = document.getElementById("score");
  if (scoreEl) scoreEl.textContent = `⭐ ${value}`;
}
export function addScore(amount) {
  setScore(state.score + amount);
}
export function getScore() {
  return state.score;
}
