let state = { playerName:"", score:0, debug:true };

export function setPlayerName(name){ state.playerName=name; const el=document.getElementById("hud-player"); if(el) el.textContent=`👤 ${name}`;}
export function getPlayerName(){ return state.playerName;}
export function setScore(val){ state.score=val; const el=document.getElementById("score"); if(el) el.textContent=`⭐ ${state.score}`;}
export function addScore(val){ setScore(state.score+val);}
export function getScore(){ return state.score;}
export function toggleDebug(on){ state.debug=on; console.log("[DBG] Mode debug",on);}
