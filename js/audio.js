import { dlog, dwarn, derr } from "./debug.js";

let ambience = null;
let currentScreen = null;
let actionSounds = {};

// -----------------------------
// Initialisation audio après interaction utilisateur
// -----------------------------
export function initAudioOnUserGesture() {
  if (!ambience) {
    dlog("Initialisation de l'audio global");
    ambience = new Audio("assets/audio/ambiance.mp3");
    ambience.loop = true;
    ambience.volume = 0.25;
    ambience.play().catch(e => dwarn("Ambience play bloquée", e));
  }
}

// -----------------------------
// Jouer la musique associée à un écran
// -----------------------------
export function playAudioForScreen(screenName) {
  dlog(`playAudioForScreen("${screenName}")`);

  stopAllAudio(); // coupe toutes les musiques avant

  switch(screenName) {
    case "pseudo":
      // Pas de musique
      currentScreen = null;
      break;
    case "intro":
      currentScreen = new Audio("assets/audio/intro.mp3");
      break;
    case "game":
      currentScreen = new Audio("assets/audio/ambiance.mp3");
      currentScreen.loop = true;
      currentScreen.volume = 0.25;
      break;
    case "victory":
      currentScreen = new Audio("assets/audio/victoire.mp3");
      break;
    case "defeat":
      currentScreen = new Audio("assets/audio/defaite.mp3");
      break;
    default:
      dlog(`Audio inconnu pour l'écran : ${screenName}`);
      currentScreen = null;
  }

  if (currentScreen) {
    currentScreen.play().catch(e => dwarn("playAudioForScreen() bloqué", e));
  }
}

// -----------------------------
// Couper toutes les musiques
// -----------------------------
export function stopAllAudio() {
  if (ambience) { ambience.pause(); ambience.currentTime = 0; }
  if (currentScreen) { currentScreen.pause(); currentScreen.currentTime = 0; }
}

// -----------------------------
// Passer en ambiance stress
// -----------------------------
export function switchToStressAmbience() {
  if (!ambience) return;
  dlog("switchToStressAmbience()");
  try {
    ambience.pause();
    ambience = new Audio("assets/audio/ambiance_stress.mp3");
    ambience.loop = true;
    ambience.volume = 0.25;
    ambience.play().catch(e => dwarn("switchToStressAmbience() play blocked", e));
  } catch(e){ derr("Erreur switchToStressAmbience", e); }
}

// -----------------------------
// Revenir en ambiance normale
// -----------------------------
export function switchToNormalAmbience() {
  if (!ambience) return;
  dlog("switchToNormalAmbience()");
  try {
    ambience.pause();
    ambience = new Audio("assets/audio/ambiance.mp3");
    ambience.loop = true;
    ambience.volume = 0.25;
    ambience.play().catch(e => dwarn("switchToNormalAmbience() play blocked", e));
  } catch(e){ derr("Erreur switchToNormalAmbience", e); }
}

// -----------------------------
// Effets sonores ponctuels
// -----------------------------
export function playActionEffect(name) {
  let src = null;
  switch(name) {
    case "bonus": src = "assets/audio/bonus.mp3"; break;
    case "error": src = "assets/audio/erreur.mp3"; break;
    case "teleport": src = "assets/audio/teleportation.mp3"; break;
    default: dwarn(`Effet audio inconnu : ${name}`); return;
  }
  const a = new Audio(src);
  a.volume = 0.5;
  a.play().catch(e => dwarn("playActionEffect() bloqué", e));
}

// -----------------------------
// Jouer un son ponctuel générique
// -----------------------------
export function playOne(src, volume = 0.4) {
  const a = new Audio(src);
  a.volume = volume;
  a.play().catch(e => dwarn("playOne() bloqué", e));
  return a;
}
