let state = {
  playerName: "",
  score: 0,
  debug: true
};

export function setPlayerName(name) {
  state.playerName = name;
  const hud = document.getElementById("hud-player");
  if(hud) hud.textContent = `👤 ${name}`;
}
export function getPlayerName() { return state.playerName; }

export function setScore(value) {
  state.score = value;
  const el = document.getElementById("score");
  if(el) el.textContent = `⭐ ${value}`;
}
export function addScore(amount) { setScore(state.score + amount); }
export function getScore() { return state.score; }

export function toggleDebug(on) { state.debug = on; }
