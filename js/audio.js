import { dlog, dwarn } from "./debug.js";

let currentAudio = null;
let stressAudio = null;

export function initAudioOnUserGesture() {
  dlog("initAudioOnUserGesture() appelé");
  // Pré-charger musiques
  stressAudio = new Audio("assets/audio/ambiance_stress.mp3");
  stressAudio.loop = true;

  currentAudio = new Audio("assets/audio/intro.mp3");
  currentAudio.loop = true;
  currentAudio.play().catch(()=>{});
}

export function stopAllAudio() {
  if (currentAudio) { currentAudio.pause(); currentAudio = null; }
  if (stressAudio) { stressAudio.pause(); stressAudio = null; }
}

export function switchToStressAmbience() {
  if (currentAudio) { currentAudio.pause(); }
  if (!stressAudio) stressAudio = new Audio("assets/audio/ambiance_stress.mp3");
  stressAudio.loop = true;
  stressAudio.play().catch(()=>{});
  currentAudio = stressAudio;
}

export function switchToNormalAmbience() {
  if (currentAudio) currentAudio.pause();
  currentAudio = new Audio("assets/audio/ambiance.mp3");
  currentAudio.loop = true;
  currentAudio.play().catch(()=>{});
}

export function playActionEffect(name) {
  const knownEffects = ["bonus","error"];
  if (!knownEffects.includes(name)) return dwarn(`Effet audio inconnu : ${name}`);
  const audio = new Audio(`assets/audio/${name}.mp3`);
  audio.play().catch(()=>{});
}

export function playAudioForScreen(screenName) {
  switch(screenName) {
    case "pseudo": currentAudio = new Audio("assets/audio/intro.mp3"); break;
    case "intro": currentAudio = new Audio("assets/audio/intro.mp3"); break;
    case "game": currentAudio = new Audio("assets/audio/ambiance.mp3"); break;
    case "victory": currentAudio = new Audio("assets/audio/victoire.mp3"); break;
    case "defeat": currentAudio = new Audio("assets/audio/defaite.mp3"); break;
    default: currentAudio = new Audio("assets/audio/ambiance.mp3");
  }
  currentAudio.loop = screenName === "game" || screenName === "pseudo" || screenName === "intro";
  currentAudio.play().catch(()=>{});
}
