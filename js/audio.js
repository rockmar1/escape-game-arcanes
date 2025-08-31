import { log } from "./config.js";

let ambience = null;
let currentAmbience = null;

// --- Sons d'ambiance ---
const ambienceTracks = {
  normal: "assets/audio/ambiance.mp3",
  stress: "assets/audio/ambiance_stress.mp3",
};

// --- Sons ponctuels ---
const sfxMap = {
  intro: "assets/audio/intro.mp3",
  victoire: "assets/audio/victoire.mp3",
  defaite: "assets/audio/defaite.mp3",
  alternative_fin1: "assets/audio/alternative_fin1.mp3",
  alternative_fin2: "assets/audio/alternative_fin2.mp3",
  plume: "assets/audio/plume.mp3",
  rune: "assets/audio/rune.mp3",
  potion: "assets/audio/potion.mp3",
  cristal: "assets/audio/cristal.mp3",
  etoile: "assets/audio/etoile.mp3",
  labyrinthe: "assets/audio/labyrinthe.mp3",
  indice: "assets/audio/indice.mp3",
  bonus: "assets/audio/bonus.mp3",
  scintillement: "assets/audio/scintillement.mp3",
  souffle: "assets/audio/souffle.mp3",
  teleportation: "assets/audio/teleportation.mp3",
  item: "assets/audio/item.mp3",
  erreur: "assets/audio/erreur.mp3",
  portail: "assets/audio/portail.mp3",
};

// --- Fonctions de lecture ---
export function playOne(src, volume = 0.4) {
  const a = new Audio(src);
  a.volume = volume;
  a.play().catch(e => log("playOne blocked", e));
  return a;
}

export function playSfx(name, volume = 0.4) {
  const src = sfxMap[name];
  if (src) return playOne(src, volume);
  console.warn("SFX inconnu :", name);
}

// --- Gestion de l'ambiance ---
export function startAmbience(track = "normal", volume = 0.25) {
  if (currentAmbience) stopAmbience(200); // fondu de l'ancien
  const src = ambienceTracks[track];
  if (!src) return console.warn("Ambiance inconnue :", track);

  ambience = new Audio(src);
  ambience.loop = true;
  ambience.volume = 0;
  ambience.play().catch(e => log("Ambience play blocked", e));
  currentAmbience = track;

  // fade-in
  let step = 0.02;
  const fade = setInterval(() => {
    if (ambience.volume < volume) ambience.volume = Math.min(volume, ambience.volume + step);
    else clearInterval(fade);
  }, 50);
}

export function stopAmbience(duration = 800) {
  if (!ambience) return;
  const step = 50;
  const steps = duration / step;
  const volStart = ambience.volume;
  let i = 0;

  const handle = setInterval(() => {
    i++;
    ambience.volume = Math.max(0, volStart * (1 - i / steps));
    if (i >= steps) {
      ambience.pause();
      ambience.currentTime = 0;
      currentAmbience = null;
      clearInterval(handle);
    }
  }, step);
}

export function switchAmbience(track = "normal", duration = 800, volume = 0.25) {
  if (currentAmbience === track) return; // déjà joué
  stopAmbience(duration);
  setTimeout(() => startAmbience(track, volume), duration + 50);
}

// --- Fonction centrale écran → son ---
const screenAudioMap = {
  intro: () => playSfx("intro"),
  game: () => startAmbience("normal"),
  victory: () => playSfx("victoire"),
  defeat: () => playSfx("defaite"),
};

// Option 1 : écrans sans son ignorés
export function playAudio(screen) {
  const fn = screenAudioMap[screen];
  if (fn) fn(); // sinon on ignore
}

// --- Helper simple pour jouer un SFX depuis n'importe où ---
export function playEffect(name, volume = 0.4) {
  playSfx(name, volume);
}

// --- Super helper pour puzzles : action automatique ---
export function playActionEffect(action, item = null, volume = 0.4) {
  switch(action) {
    case "collect":
      if (item && sfxMap[item]) {
        playSfx(item, volume);
      } else {
        playSfx("item", volume); // son générique
      }
      break;
    case "error":
      playSfx("erreur", volume);
      break;
    case "bonus":
      playSfx("bonus", volume);
      break;
    case "teleport":
      playSfx("teleportation", volume);
      break;
    case "scintillement":
      playSfx("scintillement", volume);
      break;
    default:
      console.warn("Action audio inconnue :", action, item);
  }
}
