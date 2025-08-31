import { debugLog } from "./state.js";

let ambience = null;
let ambienceStress = null;
let currentAmbience = null;

// Initialiser la musique sur le premier clic utilisateur
export function initAudioOnUserGesture() {
  if (!ambience) {
    ambience = new Audio("assets/audio/ambiance.mp3");
    ambience.loop = true;
    ambience.volume = 0.25;
  }
  if (!ambienceStress) {
    ambienceStress = new Audio("assets/audio/ambiance_stress.mp3");
    ambienceStress.loop = true;
    ambienceStress.volume = 0.25;
  }
  if (!currentAmbience) {
    currentAmbience = ambience;
    currentAmbience.play().catch(e => debugLog("Ambience play blocked: " + e));
  }
}

// Arrêter toutes les musiques
export function stopAllAudio() {
  [ambience, ambienceStress].forEach(a => {
    if (a) { a.pause(); a.currentTime = 0; }
  });
  currentAmbience = null;
}

// Jouer un son ponctuel (bonus, erreur, potion, rune…)
export function playActionEffect(name) {
  let src = null;
  switch (name) {
    case "potion": src = "assets/audio/potion.mp3"; break;
    case "rune": src = "assets/audio/rune.mp3"; break;
    case "etoile": src = "assets/audio/etoile.mp3"; break;
    case "item": src = "assets/audio/item.mp3"; break;
    case "bonus": src = "assets/audio/bonus.mp3"; break;
    case "error": src = "assets/audio/erreur.mp3"; break;
    default: src = null;
  }
  if (src) {
    const s = new Audio(src);
    s.volume = 0.5;
    s.play().catch(() => {});
  }
}

// Passer à la musique stress (quand il reste peu de temps)
export function switchToStressAmbience() {
  if (!currentAmbience || currentAmbience === ambienceStress) return;
  const vol = currentAmbience.volume;
  currentAmbience.pause();
  ambienceStress.volume = vol;
  currentAmbience = ambienceStress;
  currentAmbience.play().catch(() => {});
}

// Revenir à la musique normale
export function switchToNormalAmbience() {
  if (!currentAmbience || currentAmbience === ambience) return;
  const vol = currentAmbience.volume;
  currentAmbience.pause();
  ambience.volume = vol;
  currentAmbience = ambience;
  currentAmbience.play().catch(() => {});
}
