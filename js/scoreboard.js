// js/scoreboard.js
// Simple in-memory scoreboard with localStorage persistence

import { dlog } from "./debug.js";

const STORAGE_KEY = "eg_scores_v1";
let scores = [];

export function loadScores(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    scores = raw ? JSON.parse(raw) : [];
    dlog("Scoreboard loaded", scores.length);
  } catch(e){
    scores = [];
    dlog("Scoreboard load failed", e);
  }
}

export function saveScores(){
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
    dlog("Scoreboard saved");
  } catch(e){ dlog("Scoreboard save failed", e); }
}

export function addScoreEntry(entry){
  // entry = { pseudo, result, score, time, date }
  scores.push(entry);
  // keep most recent first
  scores = scores.slice(-50);
  saveScores();
}

export function clearScores(){
  scores = [];
  saveScores();
}

export function renderScoreboardTo(elementId = "scoreboard-list"){
  const el = document.getElementById(elementId);
  if (!el) return;
  el.innerHTML = "";
  // sort by score desc then date
  const sorted = [...scores].sort((a,b)=> (b.score||0)-(a.score||0));
  if(sorted.length===0){ el.innerHTML = "<li>Aucun score enregistré.</li>"; return; }
  for(const s of sorted){
    const li = document.createElement("li");
    li.textContent = `${s.pseudo} — ${s.result.toUpperCase()} — ${s.score || 0}pts — ${s.time} — ${s.date}`;
    el.appendChild(li);
  }
}

loadScores();
