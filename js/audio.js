// audio.js

// Déclare les sons disponibles
const sfx = {
  correct: new Audio("./assets/audio/sfx-correct.mp3"),
  error: new Audio("./assets/audio/sfx-error.mp3"),
  portal: new Audio("./assets/audio/sfx-portal.mp3"),
  quill: new Audio("./assets/audio/sfx-quill.mp3"),
};

const music = {
  intro: new Audio("./assets/audio/intro.mp3"),
  game: new Audio("./assets/audio/game.mp3"),
  stress: new Audio("./assets/audio/stress.mp3"),
  victory: new Audio("./assets/audio/victory.mp3"),
  defeat: new Audio("./assets/audio/defeat.mp3"),
};

// Fonction pour jouer un SFX
export function playSfx(name) {
  if (sfx[name]) {
    sfx[name].currentTime = 0; // reset au début
    sfx[name].play().catch(err => {
      console.warn(`⚠️ Impossible de jouer le son SFX "${name}"`, err);
    });
  } else {
    console.warn(`⚠️ SFX introuvable : ${name}`);
  }
}

// Fonction pour jouer une musique
export function playMusic(name, loop = true) {
  stopAllMusic();

  if (music[name]) {
    music[name].loop = loop;
    music[name].play().catch(err => {
      console.warn(`⚠️ Impossible de jouer la musique "${name}"`, err);
    });
  } else {
    console.warn(`⚠️ Musique introuvable : ${name}`);
  }
}

// Stoppe toutes les musiques en cours
export function stopAllMusic() {
  Object.values(music).forEach(track => {
    track.pause();
    track.currentTime = 0;
  });
}
