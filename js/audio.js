// audio.js
import { dlog } from "./debug.js";

const musics = {
  intro: new Audio("./assets/audio/intro.mp3"),
  victory: new Audio("./assets/audio/victory.mp3"),
  defeat: new Audio("./assets/audio/defeat.mp3"),
  ambience: new Audio("./assets/audio/ambience.mp3"),
  stress: new Audio("./assets/audio/stress.mp3"),
};

const sfx = {
  quill: new Audio("./assets/audio/quill.mp3"),
  click: new Audio("./assets/audio/click.mp3"),
};

let currentMusic = null;

function stop(audio) {
  audio.pause();
  audio.currentTime = 0;
}

export function stopAllMusic() {
  Object.values(musics).forEach(a => stop(a));
  currentMusic = null;
  dlog("stopAllMusic");
}

export function playMusic(name, loop = true) {
  stopAllMusic();
  if (musics[name]) {
    musics[name].loop = loop;
    musics[name].play().catch(err => dlog("Audio error", err));
    currentMusic = musics[name];
    dlog("playMusic", name);
  }
}

export function playSfx(name) {
  if (sfx[name]) {
    sfx[name].cloneNode().play();
    dlog("playSfx", name);
  }
}

export function switchToStressAmbience() {
  stopAllMusic();
  playMusic("stress", true);
  dlog("switchToStressAmbience");
}
