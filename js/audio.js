import { log, warn } from "./debug.js";

let currentMusic = null;
const musicTracks = {
  intro: new Audio("assets/audio/intro.mp3"),
  game: new Audio("assets/audio/game.mp3"),
  stress: new Audio("assets/audio/stress.mp3"),
  victory: new Audio("assets/audio/victory.mp3"),
  defeat: new Audio("assets/audio/defeat.mp3")
};

const sfxTracks = {
  quill: new Audio("assets/audio/sfx-quill.mp3"),
  correct: new Audio("assets/audio/sfx-correct.mp3"),
  error: new Audio("assets/audio/sfx-error.mp3"),
  portal: new Audio("assets/audio/sfx-portal.mp3")
};

// =======================
// Initialisation Audio
// =======================
export function initAudioOnUserGesture() {
  log("initAudioOnUserGesture called");
  Object.values(musicTracks).forEach(track => {
    track.volume = 0.6;
    track.loop = true;
  });
  Object.values(sfxTracks).forEach(sfx => sfx.volume = 0.8);
}

// =======================
// Musiques de fond
// =======================
export function playMusic(name) {
  stopAllMusic();
  const track = musicTracks[name];
  if (!track) {
    warn(`Impossible de jouer '${name}' (track introuvable)`);
    return;
  }
  currentMusic = track;
  track.currentTime = 0;
  track.play().catch(() => warn(`playMusic(${name}) bloqué`));
  log(`playMusic ${name} lancé`);
}

export function stopAllMusic() {
  Object.values(musicTracks).forEach(track => {
    track.pause();
    track.currentTime = 0;
  });
  currentMusic = null;
  log("stopAllMusic");
}

// =======================
// SFX
// =======================
export function playSfx(name) {
  const sfx = sfxTracks[name];
  if (!sfx) {
    warn(`Effet audio inconnu : ${name}`);
    return;
  }
  sfx.currentTime = 0;
  sfx.play().catch(() => warn(`playSfx(${name}) bloqué`));
  log(`playSfx ${name}`);
}

// =======================
// Ambiances
// =======================
export function switchToStressAmbience() {
  log("switchToStressAmbience");
  playMusic("stress");
}

export function switchToNormalAmbience() {
  log("switchToNormalAmbience");
  playMusic("game");
}
