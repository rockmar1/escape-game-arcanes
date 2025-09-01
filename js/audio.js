import { dlog, dwarn, derr } from "./debug.js";

let currentMusic = null;
let audioContextInitialized = false;

// === Sons de fond ===
const musicTracks = {
  intro: "assets/audio/intro.mp3",
  game: "assets/audio/ambiance.mp3",
  stress: "assets/audio/ambiance_stress.mp3",
  victory: "assets/audio/victoire.mp3",
  defeat: "assets/audio/defaite.mp3"
};

// === Effets sonores ===
const soundEffects = {
  bonus: "assets/audio/bonus.mp3",
  error: "assets/audio/error.mp3"
};

// --- Initialisation contexte audio pour le navigateur ---
export function initAudioOnUserGesture() {
  if (audioContextInitialized) return;
  try {
    // Some browsers require user gesture to start audio
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') ctx.resume();
    audioContextInitialized = true;
    dlog("initAudioOnUserGesture() appelé");
  } catch (e) {
    derr("Impossible d'initialiser le contexte audio:", e);
  }
}

// --- Jouer musique de fond ---
export function playMusic(trackName, loop = true) {
  if (!musicTracks[trackName]) {
    dwarn(`Musique inconnue : ${trackName}`);
    return;
  }

  stopAllAudio(); // Stop toute musique précédente

  currentMusic = new Audio(musicTracks[trackName]);
  currentMusic.loop = loop;
  currentMusic.volume = 0.5;
  currentMusic.play().catch(e => dwarn(`Impossible de jouer ${trackName}:`, e));
  dlog(`playMusic(${trackName}) lancé`);
}

// --- Changer musique en stress ---
export function switchToStressAmbience() {
  dlog("switchToStressAmbience() appelé");
  playMusic("stress", true);
}

// --- Jouer effets ---
export function playActionEffect(effectName) {
  if (!soundEffects[effectName]) {
    dwarn(`Effet audio inconnu : ${effectName}`);
    return;
  }
  const fx = new Audio(soundEffects[effectName]);
  fx.volume = 0.7;
  fx.play().catch(e => dwarn(`Impossible de jouer effet ${effectName}:`, e));
}

// --- Stop toutes les musiques ---
export function stopAllAudio() {
  if (currentMusic) {
    currentMusic.pause();
    currentMusic.currentTime = 0;
    currentMusic = null;
  }
  dlog("Toutes les musiques stoppées");
}

// --- Jouer musique selon écran ---
export function playAudioForScreen(screenName) {
  switch(screenName) {
    case "intro":
      playMusic("intro");
      break;
    case "game":
      playMusic("game");
      break;
    case "victory":
      stopAllAudio();
      playMusic("victory", false);
      break;
    case "defeat":
      stopAllAudio();
      playMusic("defeat", false);
      break;
    default:
      dwarn(`Aucune musique assignée pour l'écran ${screenName}`);
  }
}
