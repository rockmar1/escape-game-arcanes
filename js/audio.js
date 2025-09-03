import { dlog, dwarn } from "./debug.js";

let currentMusic = null;
const audioCache = {};

// 🎵 Mapping des musiques de fond
const screenMusic = {
  intro: "assets/audio/intro.mp3",
  game: "assets/audio/game.mp3",
  victory: "assets/audio/victory.mp3",
  defeat: "assets/audio/defeat.mp3",
  stress: "assets/audio/stress.mp3",
};

// 🔊 Mapping des effets sonores
const sfx = {
  quill: "assets/audio/sfx-quill.mp3",
  correct: "assets/audio/sfx-correct.mp3",
  error: "assets/audio/sfx-error.mp3",
  portal: "assets/audio/sfx-portal.mp3",
};

// === Gestion musique ===
export function playMusic(name) {
  stopAllMusic();

  const src = screenMusic[name];
  if (!src) {
    dwarn(`Aucune musique assignée pour ${name}`);
    return;
  }

  if (!audioCache[src]) {
    audioCache[src] = new Audio(src);
    audioCache[src].loop = true;
  }

  currentMusic = audioCache[src];
  currentMusic.volume = 0.6;

  currentMusic.play().then(() => {
    dlog(`🎵 playMusic ${name}`);
  }).catch(err => {
    dwarn(`Impossible de jouer ${src}`, err);
  });
}

export function stopAllMusic() {
  Object.values(audioCache).forEach(a => {
    a.pause();
    a.currentTime = 0;
  });
  currentMusic = null;
  dlog("🔇 stopAllMusic");
}

// === Switch musique stress (quand timer < 5min) ===
export function switchToStressAmbience() {
  if (currentMusic) {
    currentMusic.pause();
  }
  playMusic("stress");
  dlog("⚡ switchToStressAmbience lancé");
}

// === Effets sonores ===
export function playSfx(name) {
  const src = sfx[name];
  if (!src) {
    dwarn(`Effet audio inconnu : ${name}`);
    return;
  }

  const sfxAudio = new Audio(src);
  sfxAudio.volume = 0.8;
  sfxAudio.play().then(() => {
    dlog(`🔊 playSfx ${name}`);
  }).catch(err => {
    dwarn(`Impossible de jouer SFX ${src}`, err);
  });
}
