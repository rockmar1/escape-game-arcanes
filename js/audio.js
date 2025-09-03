import { dlog, dwarn } from './debug.js';

let currentMusic = null;
const audios = {
  intro: 'assets/audio/intro.mp3',
  game: 'assets/audio/game.mp3',
  victory: 'assets/audio/victory.mp3',
  defeat: 'assets/audio/defeat.mp3',
  sfx_quill: 'assets/audio/sfx-quill.mp3',
  sfx_correct: 'assets/audio/sfx-correct.mp3',
  sfx_error: 'assets/audio/sfx-error.mp3',
  sfx_portal: 'assets/audio/sfx-portal.mp3'
};

export function playMusic(key) {
  stopAllMusic();
  if (!audios[key]) return dwarn(`Aucune musique pour ${key}`);
  currentMusic = new Audio(audios[key]);
  currentMusic.loop = true;
  currentMusic.play().catch(()=>{});
  dlog(`playMusic ${key}`);
}

export function playSfx(key) {
  if (!audios[key]) return dwarn(`Aucun sfx pour ${key}`);
  const sfx = new Audio(audios[key]);
  sfx.play().catch(()=>{});
  dlog(`playSfx ${key}`);
}

export function stopAllMusic() {
  if (currentMusic) {
    currentMusic.pause();
    currentMusic.currentTime = 0;
    currentMusic = null;
    dlog('stopAllMusic');
  }
}
