// js/state.js
// lightweight game state (player name, score, debug flag)
import { dlog } from "./debug.js";

const STATE = {
  playerName: "",
  score: 0,
  debug: true
};

export function setPlayerName(name){
  STATE.playerName = name;
  dlog("Player name set:", name);
  const el = document.getElementById("hud-player");
  if (el) el.textContent = `👤 ${name}`;
}
export function getPlayerName(){ return STATE.playerName; }

export function setScore(val){
  STATE.score = val;
  _renderScore();
}
export function addScore(n){
  STATE.score += n;
  _renderScore();
}
export function getScore(){ return STATE.score; }

export function resetScore(){
  STATE.score = 0;
  _renderScore();
}

function _renderScore(){
  const el = document.getElementById("score");
  if (el) el.textContent = `⭐ ${STATE.score}`;
}
