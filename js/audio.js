// audio.js : Gestion des musiques et effets
import { dwarn, dlog } from "./debug.js";

let currentMusic = null;
let audioMap = {
  intro: new Audio("assets/audio/intro.mp3"),
  game: new Audio("assets/audio/ambiance_game.mp3"),
  stress: new Audio("assets/audio/ambiance_stress.mp3"),
  victoire: new Audio("assets/audio/victoire.mp3"),
  defaite: new Audio("assets/audio/defaite.mp3")
};

export function playMusic(key, loop = true) {
  stopAllAudio();
  if (!audioMap[key]) {
    dwarn(`Impossible de jouer ${key}`);
    return;
  }
  currentMusic = audioMap[key];
  currentMusic.loop = loop;
  currentMusic.play().catch(() => {});
  dlog(`playMusic(${key}) lancé`);
}

export function stopAllAudio() {
  Object.values(audioMap).forEach(a => {
    a.pause();
    a.currentTime = 0;
  });
  currentMusic = null;
  dlog("Toutes les musiques stoppées");
}

export function switchToStressAmbience() {
  if (!audioMap.stress) return;
  playMusic("stress");
}

export function playActionEffect(effect) {
  // exemples simples, ajouter plus si besoin
  const effects = {
    bonus: new Audio("assets/audio/bonus.mp3"),
    error: new Audio("assets/audio/error.mp3"),
    collect: new Audio("assets/audio/collect.mp3")
  };
  if (!effects[effect]) {
    dwarn(`Effet audio inconnu : ${effect}`);
    return;
  }
  effects[effect].play().catch(() => {});
}

// Initialisation audio au premier clic
export function initAudioOnUserGesture() {
  dlog("initAudioOnUserGesture() appelé");
  document.body.addEventListener("click", () => {
    Object.values(audioMap).forEach(a => a.play().then(()=>a.pause()));
  }, { once: true });
}
