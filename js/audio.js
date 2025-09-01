// audio.js
import { dlog, dwarn } from "./debug.js";

// === État audio global ===
let audioContextInitialized = false;
let currentAmbience = null;
let stressAmbience = null;
let normalAmbience = null;
let effectAudios = {};

// Musiques
const ASSETS = {
  intro: "assets/audio/intro.mp3",
  game: "assets/audio/ambiance.mp3",
  stress: "assets/audio/ambiance_stress.mp3",
  victory: "assets/audio/victoire.mp3",
  defeat: "assets/audio/defaite.mp3",
  effects: {
    bonus: "assets/audio/bonus.mp3",
    error: "assets/audio/error.mp3"
  }
};

// ==============================
// Initialisation clic utilisateur
// ==============================
export function initAudioOnUserGesture() {
  if (audioContextInitialized) return;
  dlog("initAudioOnUserGesture() appelé");

  // créer un objet AudioContext si nécessaire
  try {
    normalAmbience = new Audio(ASSETS.game);
    normalAmbience.loop = true;
    normalAmbience.volume = 0.5;

    stressAmbience = new Audio(ASSETS.stress);
    stressAmbience.loop = true;
    stressAmbience.volume = 0.5;

    currentAmbience = new Audio(ASSETS.intro);
    currentAmbience.loop = true;
    currentAmbience.volume = 0.5;
    currentAmbience.play().catch(() => dwarn("Lecture intro bloquée"));

    // Précharger effets
    for (const [key, src] of Object.entries(ASSETS.effects)) {
      effectAudios[key] = new Audio(src);
    }

    audioContextInitialized = true;
    dlog("Audio global initialisé");
  } catch (e) {
    dwarn("Erreur initAudioOnUserGesture:", e);
  }
}

// ==============================
// Gestion de l’ambiance
// ==============================
export function switchToNormalAmbience() {
  stopCurrentAmbience();
  if (!normalAmbience) return;
  currentAmbience = normalAmbience;
  currentAmbience.play().catch(() => dwarn("Lecture normalAmbience bloquée"));
  dlog("switchToNormalAmbience()");
}

export function switchToStressAmbience() {
  stopCurrentAmbience();
  if (!stressAmbience) return;
  currentAmbience = stressAmbience;
  currentAmbience.play().catch(() => dwarn("Lecture stressAmbience bloquée"));
  dlog("switchToStressAmbience()");
}

export function stopAllAudio() {
  if (currentAmbience) { currentAmbience.pause(); currentAmbience.currentTime = 0; }
  if (normalAmbience) { normalAmbience.pause(); normalAmbience.currentTime = 0; }
  if (stressAmbience) { stressAmbience.pause(); stressAmbience.currentTime = 0; }
  for (const key in effectAudios) {
    effectAudios[key].pause();
    effectAudios[key].currentTime = 0;
  }
  dlog("stopAllAudio()");
}

function stopCurrentAmbience() {
  if (currentAmbience) currentAmbience.pause();
}

// ==============================
// Effets sonores
// ==============================
export function playActionEffect(effectName) {
  const audio = effectAudios[effectName];
  if (!audio) {
    dwarn(`Effet audio inconnu : ${effectName}`);
    return;
  }
  audio.currentTime = 0;
  audio.play().catch(() => dwarn(`playActionEffect(${effectName}) bloqué`));
  dlog(`playActionEffect(${effectName})`);
}

// ==============================
// Lecture selon écran
// ==============================
export function playAudioForScreen(screenName) {
  dlog(`playAudioForScreen(${screenName})`);
  if (!audioContextInitialized) return;

  switch (screenName) {
    case "pseudo":
      stopCurrentAmbience();
      currentAmbience = new Audio(ASSETS.intro);
      currentAmbience.loop = true;
      currentAmbience.volume = 0.5;
      currentAmbience.play().catch(() => dwarn("Intro bloquée"));
      break;

    case "intro":
      stopCurrentAmbience();
      currentAmbience = new Audio(ASSETS.intro);
      currentAmbience.loop = true;
      currentAmbience.volume = 0.5;
      currentAmbience.play().catch(() => dwarn("Intro bloquée"));
      break;

    case "game":
      stopCurrentAmbience();
      currentAmbience = normalAmbience;
      currentAmbience.play().catch(() => dwarn("Ambiance jeu bloquée"));
      break;

    case "victory":
    case "defeat":
      stopAllAudio();
      const jingle = screenName === "victory" ? ASSETS.victory : ASSETS.defeat;
      new Audio(jingle).play().catch(()=>dwarn("Jingle final bloqué"));
      break;

    default:
      dwarn(`playAudioForScreen(): écran inconnu ${screenName}`);
  }
}
