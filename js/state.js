// js/state.js
import { dlog } from "./debug.js";
const STATE = { playerName:"", score:0 };
export function setPlayerName(n){ STATE.playerName = n; dlog("player name",n); const el = document.getElementById("hud-player"); if(el) el.textContent = `👤 ${n}`; }
export function getPlayerName(){ return STATE.playerName; }
export function setScore(v){ STATE.score = v; _render(); }
export function addScore(n){ STATE.score += n; _render(); }
export function getScore(){ return STATE.score; }
export function resetScore(){ STATE.score = 0; _render(); }
function _render(){ const el=document.getElementById("score"); if(el) el.textContent = `⭐ ${STATE.score}`; }
