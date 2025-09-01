// audio.js
import { dlog, dwarn } from "./debug.js";

let currentAudio = null;

// Mapping musique par écran
const screenMusicMap = {
  intro: "assets/audio/intro.mp3",
  game: "assets/audio/game.mp3",
  victory: "assets/audio/victory.mp3",
  defeat: "assets/audio/defeat.mp3"
};

// Lecture d’une musique
export function playMusic(file) {
  stopAllAudio();
  currentAudio = new Audio(file);
  currentAudio.loop = true;
  currentAudio.volume = 0.5;
  currentAudio.play().catch(err => {
    dwarn("Impossible de jouer " + file, err);
  });
  dlog("playMusic(" + file + ") lancé");
}

// Stop toute musique
export function stopAllAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  dlog("Toutes les musiques stoppées");
}

// Jouer la musique liée à l’écran
export function playAudioForScreen(screen) {
  const file = screenMusicMap[screen];
  if (file) {
    playMusic(file);
  } else {
    dwarn("Aucune musique assignée pour l'écran " + screen);
  }
}

// Ambiance spéciale "stressante" pour la fin du timer
export function switchToStressAmbience() {
  stopAllAudio();
  playMusic("assets/audio/stress.mp3"); // 🔥 à mettre dans assets/audio
}
