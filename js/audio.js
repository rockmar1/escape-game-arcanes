// audio.js
import { dlog, dwarn } from "./debug.js";

const musics = {
  intro: new Audio("assets/audio/intro.mp3"),
  game: new Audio("assets/audio/game.mp3"),
  stress: new Audio("assets/audio/stress.mp3"),
  victory: new Audio("assets/audio/victory.mp3"),
  defeat: new Audio("assets/audio/defeat.mp3")
};

const sfx = {
  quill: new Audio("assets/audio/sfx-quill.mp3"),
  correct: new Audio("assets/audio/sfx-correct.mp3"),
  error: new Audio("assets/audio/sfx-error.mp3"),
  portal: new Audio("assets/audio/sfx-portal.mp3")
};

export async function initAudioOnUserGesture() {
  for (let key in musics) musics[key].play().catch(() => musics[key].pause());
  for (let key in sfx) sfx[key].play().catch(() => sfx[key].pause());
  dlog("initAudioOnUserGesture done");
}

export function playMusic(name) {
  stopAllMusic();
  if (!musics[name]) return dwarn(`Aucune musique pour ${name}`);
  musics[name].loop = true;
  musics[name].play().catch(()=>{});
  dlog(`playMusic ${name} lancé`);
}

export function stopAllMusic() {
  for (let key in musics) musics[key].pause();
  dlog("stopAllMusic");
}

export function playSfx(name) {
  if (!sfx[name]) return dwarn(`SFX inconnu: ${name}`);
  sfx[name].play();
}
