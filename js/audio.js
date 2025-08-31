import { GameConfig, log } from "./config.js";
let ambience = null;
export function initAudioOnUserGesture(){
  // call on first user click (begin-game)
  if(!ambience){
    ambience = new Audio("sons/ambiance.mp3");
    ambience.loop = true;
    ambience.volume = 0.25;
    ambience.play().catch(e=>log("Ambience play blocked",e));
  }
}
export function stopAllAudio(){
  if(ambience){ ambience.pause(); ambience.currentTime=0; }
  // other transient audios handled locally
}
export function playOne(src, volume=0.4){
  const a = new Audio(src); a.volume = volume; a.play().catch(e=>log("playOne blocked",e)); return a;
}
export function fadeOutAmbience(duration=800){
  if(!ambience) return;
  const step = 50; const steps = duration/step;
  let i=0; const volStart = ambience.volume;
  const handle = setInterval(()=>{
    i++; ambience.volume = Math.max(0, volStart*(1 - i/steps));
    if(i>=steps){ ambience.pause(); ambience.currentTime=0; ambience.volume = volStart; clearInterval(handle); }
  }, step);
}
export function speedUpAmbience(factor=1.4){ if(ambience) ambience.playbackRate = factor; }
