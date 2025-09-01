import { dlog, dwarn } from "./debug.js";

let currentBgAudio = null;

export function initAudioOnUserGesture() {
  dlog("initAudioOnUserGesture() appelé");
  if(!currentBgAudio) {
    currentBgAudio = new Audio("assets/audio/intro.mp3");
    currentBgAudio.loop = true;
    currentBgAudio.play().catch(()=>{});
  }
}

export function playAudioForScreen(screenName) {
  dlog(`playAudioForScreen(${screenName})`);
  if(currentBgAudio) currentBgAudio.pause();

  let src = "";
  switch(screenName){
    case "intro": src="assets/audio/intro.mp3"; break;
    case "game": src="assets/audio/ambiance.mp3"; break;
    default: return;
  }
  currentBgAudio = new Audio(src);
  currentBgAudio.loop = true;
  currentBgAudio.play().catch(()=>{ dwarn("playAudio bloqué") });
}

export function stopAllAudio() { if(currentBgAudio){ currentBgAudio.pause(); currentBgAudio=null; } }
export function switchToStressAmbience() {
  if(currentBgAudio) currentBgAudio.pause();
  currentBgAudio = new Audio("assets/audio/ambiance_stress.mp3");
  currentBgAudio.loop = true;
  currentBgAudio.play().catch(()=>{ dwarn("Stress audio bloqué") });
}
export function playActionEffect(effect) {
  let src = "";
  switch(effect) {
    case "bonus": src="assets/audio/bonus.mp3"; break;
    case "error": src="assets/audio/error.mp3"; break;
    default: dwarn(`Effet audio inconnu : ${effect}`); return;
  }
  new Audio(src).play().catch(()=>{});
}
