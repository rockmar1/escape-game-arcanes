import { dlog, dwarn } from "./debug.js";

let currentAudio = null;
let ambienceNormal = new Audio("assets/audio/ambiance.mp3");
let ambienceStress = new Audio("assets/audio/ambiance_stress.mp3");

export function initAudioOnUserGesture() {
  dlog("initAudioOnUserGesture() appelé");
  ambienceNormal.loop = true;
  ambienceNormal.volume = 0.5;
  ambienceStress.loop = true;
  ambienceStress.volume = 0.6;
  playAmbience();
}

export function playAudioForScreen(screenName) {
  stopAllAudio();
  try {
    let src = null;
    switch(screenName) {
      case "intro": src = "assets/audio/intro.mp3"; break;
      case "game": src = "assets/audio/ambiance.mp3"; break;
      case "victory": src = "assets/audio/victoire.mp3"; break;
      case "defeat": src = "assets/audio/defaite.mp3"; break;
      default: return;
    }
    if (src) {
      currentAudio = new Audio(src);
      currentAudio.loop = (screenName === "game");
      currentAudio.play().catch(e => dwarn("Impossible de jouer " + src));
    }
  } catch(e) {
    dwarn("Erreur audio:", e);
  }
}

export function stopAllAudio() {
  if (currentAudio) currentAudio.pause();
  currentAudio = null;
  ambienceNormal.pause();
  ambienceStress.pause();
}

export function switchToStressAmbience() {
  stopAllAudio();
  ambienceStress.currentTime = 0;
  ambienceStress.play().catch(()=>{});
}

export function switchToNormalAmbience() {
  stopAllAudio();
  ambienceNormal.currentTime = 0;
  ambienceNormal.play().catch(()=>{});
}

function playAmbience() {
  ambienceNormal.currentTime = 0;
  ambienceNormal.play().catch(()=>{});
}
