// audio.js
import { dlog, dwarn } from "./debug.js";

let currentAudio = null;

export function initAudioOnUserGesture() {
  dlog("initAudioOnUserGesture() appelé");
}

export function stopAllAudio() {
  if(currentAudio) { currentAudio.pause(); currentAudio = null; }
}

export function playAudioForScreen(screenName) {
  stopAllAudio();
  let src = null;
  if(screenName === "pseudo") src = "assets/audio/intro.mp3";
  if(screenName === "intro") src = "assets/audio/intro.mp3";
  if(screenName === "game") src = "assets/audio/ambiance.mp3";
  if(screenName === "victory") src = "assets/audio/victoire.mp3";
  if(screenName === "defeat") src = "assets/audio/defaite.mp3";

  if(src) {
    currentAudio = new Audio(src);
    currentAudio.loop = screenName==="game";
    currentAudio.play().catch(()=>dwarn(`Impossible de jouer ${src}`));
  }
}

export function switchToStressAmbience() {
  stopAllAudio();
  currentAudio = new Audio("assets/audio/ambiance_stress.mp3");
  currentAudio.loop = true;
  currentAudio.play().catch(()=>dwarn("Impossible de jouer ambiance_stress.mp3"));
}

export function switchToNormalAmbience() {
  stopAllAudio();
  currentAudio = new Audio("assets/audio/ambiance.mp3");
  currentAudio.loop = true;
  currentAudio.play().catch(()=>dwarn("Impossible de jouer ambiance.mp3"));
}

export function playActionEffect(effect) {
  const known = { bonus:"assets/audio/bonus.mp3", error:"assets/audio/error.mp3" };
  if(!known[effect]) return dwarn(`Effet audio inconnu : ${effect}`);
  const sfx = new Audio(known[effect]);
  sfx.play().catch(()=>{});
}
