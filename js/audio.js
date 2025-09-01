import { dlog, dwarn, derr } from "./debug.js";

let currentAmbience = null;
let audioContext = null;

// === Initialisation au premier clic utilisateur ===
export function initAudioOnUserGesture() {
  if (audioContext) return;
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    dlog("AudioContext initialisé");
  } catch (e) { derr("Impossible d'initialiser AudioContext", e); }
}

// === Lecture d'effets sonores ===
const effects = {
  bonus: "assets/audio/bonus.mp3",
  error: "assets/audio/error.mp3"
};

export function playActionEffect(name) {
  const src = effects[name];
  if (!src) return dwarn("Effet audio inconnu :", name);
  const audio = new Audio(src);
  audio.play().catch(()=>{ dwarn("playActionEffect bloqué", name); });
}

// === Gestion Ambiance ===
const ambiences = {
  pseudo: "assets/audio/intro.mp3",
  intro: "assets/audio/intro.mp3",
  game: "assets/audio/ambiance.mp3",
  stress: "assets/audio/ambiance_stress.mp3",
  victory: "assets/audio/victoire.mp3",
  defeat: "assets/audio/defaite.mp3"
};

export function stopAllAudio() {
  if (currentAmbience) {
    currentAmbience.pause();
    currentAmbience = null;
    dlog("Ambiance stoppée");
  }
}

export function switchToNormalAmbience() {
  stopAllAudio();
  playAmbience("game");
}

export function switchToStressAmbience() {
  stopAllAudio();
  playAmbience("stress");
}

export function playAudioForScreen(screenName) {
  const src = ambiences[screenName];
  if (!src) return dwarn("Aucune musique pour l'écran :", screenName);
  playAmbience(screenName);
}

function playAmbience(name) {
  stopAllAudio();
  const src = ambiences[name];
  if (!src) return;
  currentAmbience = new Audio(src);
  currentAmbience.loop = true;
  currentAmbience.play().catch(e => {
    dwarn(`Lecture ambiance "${name}" bloquée`, e);
  });
  dlog(`Ambiance "${name}" lancée`);
}
