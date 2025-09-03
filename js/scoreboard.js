// js/scoreboard.js
import { dlog } from "./debug.js";
const KEY = "eg_scores_v1"; let scores = [];
export function loadScores(){ try{ const r=localStorage.getItem(KEY); scores=r?JSON.parse(r):[]; dlog("loadScores",scores.length);}catch(e){scores=[];} }
export function saveScores(){ try{ localStorage.setItem(KEY,JSON.stringify(scores)); dlog("saveScores"); }catch(e){} }
export function addScoreEntry(entry){ scores.push(entry); scores = scores.slice(-200); saveScores(); }
export function clearScores(){ scores=[]; saveScores(); }
export function renderScoreboardTo(id="scoreboard-list"){ const el=document.getElementById(id); if(!el) return; el.innerHTML=""; const sorted=[...scores].sort((a,b)=> (b.score||0)-(a.score||0)); if(sorted.length===0){ el.innerHTML="<li>Aucun score enregistré.</li>"; return; } for(const s of sorted){ const li=document.createElement("li"); li.textContent=`${s.pseudo} — ${s.result.toUpperCase()} — ${s.score||0}pts — ${s.time} — ${s.date}`; el.appendChild(li); } }
loadScores();
