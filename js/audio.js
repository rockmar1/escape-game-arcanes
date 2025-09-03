import { dlog, dwarn } from "./debug.js";

const musics = {
  intro: "assets/audio/intro.mp3",
  game: "assets/audio/game.mp3",
  stress: "assets/audio/stress.mp3",
  victory: "assets/audio/victory.mp3",
  defeat: "assets/audio/defeat.mp3"
};

const sfx = {
  quill: "assets/audio/sfx-quill.mp3",
  correct: "assets/audio/sfx-correct.mp3",
  error: "assets/audio/sfx-error.mp3",
  portal: "assets/audio/sfx-portal.mp3"
};

let currentMusic = null;

/**
 * Stop toutes les musiques
 */
export function stopAllMusic() {
  dlog("stopAllMusic");
  if (currentMusic) {
    currentMusic.pause();
    currentMusic.currentTime = 0;
  }
  currentMusic = null;
}

/**
 * Joue une musique de fond
 */
export function playMusic(name) {
  stopAllMusic();

  const src = musics[name];
  if (!src) {
    dwarn(`Aucune musique assignée pour ${name}`);
    return;
  }

  const audio = new Audio(src);
  audio.loop = true;
  audio.volume = 0.5;
  audio.play().catch(() => {
    dwarn(`Impossible de jouer ${src}`);
  });

  currentMusic = audio;
  dlog(`playMusic ${name}`);
}

/**
 * Joue un effet sonore
 */
export function playSfx(name) {
  const src = sfx[name];
  if (!src) {
    dwarn(`Effet sonore inconnu: ${name}`);
    return;
  }
  const audio = new Audio(src);
  audio.volume = 0.7;
  audio.play().catch(() => {
    dwarn(`Impossible de jouer sfx ${name}`);
  });
  dlog(`playSfx ${name}`);
}
