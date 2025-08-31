// state.js
export const state = {
  playerName: "",
  timer: 300,
  score: 0,
  debug: false
};

export function setPlayerName(name) {
  state.playerName = name;
}

export function resetState() {
  state.timer = 300;
  state.score = 0;
}
