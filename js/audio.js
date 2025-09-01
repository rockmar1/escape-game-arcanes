import { dlog, dwarn } from "./debug.js";

let audioIntro = new Audio("assets/audio/intro.mp3");
let audioGame = new Audio("assets/audio/ambiance.mp3");
let audioStress = new Audio("assets/audio/ambiance_stress.mp3");
let currentAudio = null;

export function initAudioOnUserGesture() {
  dlog("initAudioOnUserGesture() appelé");
  if (!currentAudio) { 
    currentAudio = audioIntro; 
    currentAudio.loop = true;
    currentAudio.play().catch(()=>{});
  }
}

export function playAudioForScreen(screen) {
  try {
    if (currentAudio) currentAudio.pause();
    if (screen === "intro") currentAudio = audioIntro;
    else if (screen === "game") currentAudio = audioGame;
    else currentAudio = null;

    if (currentAudio) {
      currentAudio.loop = true;
      currentAudio.play().catch(()=>{});
    }
    dlog(`playAudioForScreen(${screen})`);
  } catch (e) { dwarn(`playAudioForScreen() bloqué ${e}`); }
}

export function stopAllAudio() {
  [audioIntro, audioGame, audioStress].forEach(a => { try { a.pause(); a.currentTime=0; } catch{} });
}

export function switchToStressAmbience() {
  stopAllAudio();
  currentAudio = audioStress;
  currentAudio.loop = true;
  currentAudio.play().catch(()=>{});
}

export function playActionEffect(effect) {
  const src = `assets/audio/${effect}.mp3`;
  const audio = new Audio(src);
  audio.play().catch(()=>{ dwarn(`Effet audio inconnu : ${effect}`); });
}
