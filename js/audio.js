import { log } from "./debug.js";

const musicFiles = {
  intro: "assets/audio/intro.mp3",
  game: "assets/audio/game.mp3",
  victory: "assets/audio/victory.mp3",
  defeat: "assets/audio/defeat.mp3",
  stress: "assets/audio/stress.mp3"
};

const sfxFiles = {
  correct: "assets/audio/sfx-correct.mp3",
  error: "assets/audio/sfx-error.mp3",
  portal: "assets/audio/sfx-portal.mp3",
  quill: "assets/audio/sfx-quill.mp3"
};

let currentMusic = null;

export function stopAllMusic() {
  if (currentMusic) {
    currentMusic.pause();
    currentMusic.currentTime = 0;
    currentMusic = null;
    log("stopAllMusic");
  }
}

export function playMusic(name, loop = true) {
  stopAllMusic();
  const file = musicFiles[name];
  if (!file) {
    log("Musique inconnue : " + name);
    return;
  }
  const audio = new Audio(file);
  audio.loop = loop;
  audio.volume = 0.5;
  audio.play().catch(err => log("Erreur lecture musique: " + err));
  currentMusic = audio;
  log("playMusic " + name);
}

export function playSfx(name) {
  const file = sfxFiles[name];
  if (!file) {
    log("SFX inconnu : " + name);
    return;
  }
  const audio = new Audio(file);
  audio.volume = 0.8;
  audio.play().catch(err => log("Erreur lecture sfx: " + err));
  log("playSfx " + name);
}

// ✅ Fonction spéciale pour le timer (musique stress)
export function switchToStressAmbience() {
  stopAllMusic();
  playMusic("stress", true);
  log("switchToStressAmbience lancé");
}
