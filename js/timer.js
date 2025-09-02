// js/timer.js - global timer with hooks.
import { dlog } from "./debug.js";
import { switchToStressAmbience } from "./audio.js";

let interval = null;
let remaining = 600;
let onEndCb = ()=>{};
let onTickCb = ()=>{};

export function startTimer(totalSeconds = 600, onEnd = ()=>{}, onTick = ()=>{}){
  stopTimer();
  remaining = totalSeconds;
  onEndCb = onEnd; onTickCb = onTick;
  tick(); // initial update
  interval = setInterval(tick, 1000);
  dlog("Timer started", totalSeconds);
}

function tick(){
  remaining--;
  if(remaining < 0) remaining = 0;
  updateDisplay();
  onTickCb(remaining);
  if(remaining === 300){ // 5 minutes
    switchToStressAmbience();
    dlog("Timer: 5 minutes left -> stress ambience");
  }
  if(remaining === 60){
    dlog("Timer: 1 minute left");
  }
  if(remaining <= 0){
    stopTimer();
    dlog("Timer ended -> calling onEnd");
    try { onEndCb(); } catch(e){ dlog("onEnd error", e); }
  }
}

export function addSeconds(s){
  remaining = Math.max(0, remaining + s);
  updateDisplay();
}

export function halveRemaining(){
  remaining = Math.ceil(remaining/2);
  updateDisplay();
}

export function getRemaining(){ return remaining; }

export function stopTimer(){
  if(interval){ clearInterval(interval); interval = null; }
}

function updateDisplay(){
  const el = document.getElementById("timer");
  if(!el) return;
  const min = Math.floor(remaining/60);
  const sec = remaining % 60;
  el.textContent = `⏳ ${min}:${String(sec).padStart(2,"0")}`;
  el.classList.remove("warning","danger");
  if(remaining <= 60) el.classList.add("danger");
  else if(remaining <= 300) el.classList.add("warning");
}
