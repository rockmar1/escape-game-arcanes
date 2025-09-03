// js/audio.js
import { dlog, dwarn } from "./debug.js";

let currentMusic = null;
const sfxMap = {};

// --- Gestion musique ---
export function playMusic(name, loop = true) {
  stopAllMusic();
  const src = `assets/audio/${name}.mp3`;
  const audio = new Audio(src);
  audio.loop = loop;
  audio.play()
    .then(() => {
      dlog(`playMusic(${name}) lancé`);
    })
    .catch(err => {
      dwarn(`Impossible de jouer ${src}`, err);
    });
  currentMusic = audio;
}

export function stopAllMusic() {
  if (currentMusic) {
    currentMusic.pause();
    currentMusic.currentTime = 0;
    dlog("stopAllMusic");
    currentMusic = null;
  }
}

// --- Gestion effets ---
export function loadSfx(name, file) {
  const audio = new Audio(file);
  sfxMap[name] = audio;
}

export function playSfx(name) {
  const audio = sfxMap[name];
  if (!audio) {
    dwarn(`Effet audio inconnu : ${name}`);
    return;
  }
  audio.currentTime = 0;
  audio.play().catch(err => {
    dwarn(`Impossible de jouer l'effet ${name}`, err);
  });
}

// --- Initialisation audio sur interaction utilisateur ---
let userGestureInitDone = false;
export function initAudioOnUserGesture() {
  if (userGestureInitDone) return;
  document.addEventListener("click", firstClickHandler, { once: true });
}

function firstClickHandler() {
  dlog("initAudioOnUserGesture done");
  // Précharger les effets
  loadSfx("quill", "assets/audio/sfx-quill.mp3");
  loadSfx("correct", "assets/audio/sfx-correct.mp3");
  loadSfx("error", "assets/audio/sfx-error.mp3");
  loadSfx("portal", "assets/audio/sfx-portal.mp3");
  userGestureInitDone = true;
}

// --- Fonctions pour changer ambiance stress/normal ---
export function switchToStressAmbience() {
  playMusic("stress");
}
export function switchToNormalAmbience() {
  playMusic("game");
}

// --- Fonction utilitaire pour arrêter tout (musique + effets si besoin) ---
export function stopAllAudio() {
  stopAllMusic();
  Object.values(sfxMap).forEach(a => { a.pause(); a.currentTime = 0; });
}
