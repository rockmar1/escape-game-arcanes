// audio.js
import { dlog, dwarn, derr } from "./debug.js";

let currentAudio = null;
let ambienceAudio = null;
let normalAmbienceSrc = "assets/audio/ambiance.mp3";
let stressAmbienceSrc = "assets/audio/ambiance_stress.mp3";

// ==========================
// Initialisation audio sur geste utilisateur
// ==========================
export function initAudioOnUserGesture() {
  dlog("Initialisation de l'audio global");
  // On peut éventuellement jouer un jingle ou preload les sons
}

// ==========================
// Lecture audio pour un écran
// ==========================
export function playAudioForScreen(screen) {
  const screenMap = {
    intro: "assets/audio/intro.mp3",
    game: normalAmbienceSrc,
    victory: "assets/audio/victoire.mp3",
    defeat: "assets/audio/defaite.mp3"
  };
  const src = screenMap[screen];
  if (!src) return;

  // Si l'audio en cours est le même, ne rien faire
  if (currentAudio && !currentAudio.paused && currentAudio.src.includes(src)) return;

  // Arrêter l'audio précédent
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  currentAudio = new Audio(src);
  if (screen === "game") {
    currentAudio.loop = true;
    ambienceAudio = currentAudio; // pour gérer stress
  }
  currentAudio.volume = 0.25;
  currentAudio.play().catch(e => dwarn("playAudioForScreen() bloqué", e));
}

// ==========================
// Stop tous les audios
// ==========================
export function stopAllAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if (ambienceAudio) {
    ambienceAudio.pause();
    ambienceAudio.currentTime = 0;
    ambienceAudio = null;
  }
}

// ==========================
// Switch vers ambiance stress
// ==========================
export function switchToStressAmbience() {
  if (!ambienceAudio) return;
  dlog("Switch vers musique stress");
  const currentTime = ambienceAudio.currentTime;
  ambienceAudio.pause();
  ambienceAudio = new Audio(stressAmbienceSrc);
  ambienceAudio.loop = true;
  ambienceAudio.volume = 0.25;
  ambienceAudio.currentTime = currentTime;
  ambienceAudio.play().catch(e => dwarn("switchToStressAmbience() bloqué", e));
  currentAudio = ambienceAudio;
}

// ==========================
// Revenir à ambiance normale
// ==========================
export function switchToNormalAmbience() {
  if (!ambienceAudio) return;
  dlog("Retour ambiance normale");
  const currentTime = ambienceAudio.currentTime;
  ambienceAudio.pause();
  ambienceAudio = new Audio(normalAmbienceSrc);
  ambienceAudio.loop = true;
  ambienceAudio.volume = 0.25;
  ambienceAudio.currentTime = currentTime;
  ambienceAudio.play().catch(e => dwarn("switchToNormalAmbience() bloqué", e));
  currentAudio = ambienceAudio;
}

// ==========================
// Effets ponctuels
// ==========================
export function playActionEffect(name) {
  const map = {
    bonus: "assets/audio/bonus.mp3",
    error: "assets/audio/erreur.mp3",
    plume: "assets/audio/plume.mp3",
    rune: "assets/audio/rune.mp3",
    potion: "assets/audio/potion.mp3",
    cristal: "assets/audio/cristal.mp3",
    etoile: "assets/audio/etoile.mp3",
    labyrinthe: "assets/audio/labyrinthe.mp3",
    indice: "assets/audio/indice.mp3",
    scintillement: "assets/audio/scintillement.mp3",
    souffle: "assets/audio/souffle.mp3",
    teleportation: "assets/audio/teleportation.mp3",
    portail: "assets/audio/portail.mp3",
    item: "assets/audio/item.mp3"
  };
  const src = map[name];
  if (!src) return;
  const a = new Audio(src);
  a.volume = 0.4;
  a.play().catch(e => dwarn(`playActionEffect(${name}) bloqué`, e));
}
