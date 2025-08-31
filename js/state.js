let state = {
  playerName: "",
  score: 0,
  debug: false
};

// === Gestion joueur ===
export function setPlayerName(name) {
  state.playerName = name;
  document.getElementById("hud-player").textContent = `👤 ${name}`;
}
export function getPlayerName() {
  return state.playerName;
}

// === Score ===
export function setScore(value) {
  state.score = value;
  document.getElementById("score").textContent = `⭐ ${value}`;
}
export function addScore(amount) {
  state.score += amount;
  document.getElementById("score").textContent = `⭐ ${state.score}`;
}
export function getScore() {
  return state.score;
}

// === Debug ===
export function toggleDebug(on) {
  state.debug = on;
  debugLog(`🔧 Mode Debug ${on ? "activé" : "désactivé"}`);
}
export function debugLog(msg) {
  if (!state.debug) return;
  const log = document.getElementById("debug-log");
  if (log) {
    log.textContent += msg + "\n";
    log.scrollTop = log.scrollHeight;
  }
}
