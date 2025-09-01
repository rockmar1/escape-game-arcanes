import { dlog } from "./debug.js";

let state = {
  playerName: "",
  score: 0,
  debug: true
};

// Joueur
export function setPlayerName(name) {
  state.playerName = name;
  const el = document.getElementById("hud-player");
  if (el) el.textContent = `👤 ${name}`;
  dlog(`Pseudo défini : ${name}`);
}
export function getPlayerName() { return state.playerName; }

// Score
export function setScore(value) {
  state.score = value;
  const el = document.getElementById("score");
  if (el) el.textContent = `⭐ ${value}`;
}
export function addScore(amount) { setScore(state.score + amount); }
export function getScore() { return state.score; }
