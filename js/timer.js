// js/timer.js
import { dlog } from "./debug.js";
import { switchToStressAmbience } from "./audio.js";

let interval=null, remaining=600, onEnd=()=>{}, onTick=()=>{};
export function startTimer(totalSeconds=600, onEndCb=()=>{}, onTickCb=()=>{}) {
  stopTimer(); remaining=totalSeconds; onEnd=onEndCb; onTick=onTickCb; update(); interval=setInterval(()=>{ remaining = Math.max(0, remaining-1); update(); onTick(remaining); if(remaining===300){ switchToStressAmbience(); dlog("5min reached -> stress"); } if(remaining===60){ dlog("1min left"); } if(remaining===0){ stopTimer(); onEnd(); } },1000);
}
export function addSeconds(s){ remaining = Math.max(0, remaining + s); update(); }
export function halveRemaining(){ remaining = Math.ceil(remaining/2); update(); }
export function getRemaining(){ return remaining; }
export function stopTimer(){ if(interval){ clearInterval(interval); interval=null; } }
function update(){ const el=document.getElementById("timer"); if(!el) return; const m=Math.floor(remaining/60), s=remaining%60; el.textContent = `⏳ ${m}:${String(s).padStart(2,"0")}`; el.classList.remove("warning","danger"); if(remaining<=60) el.classList.add("danger"); else if(remaining<=300) el.classList.add("warning"); }
