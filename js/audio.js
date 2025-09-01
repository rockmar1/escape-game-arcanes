import { dwarn } from "./debug.js";

let currentAudio = null;

const screenMusicMap = {
  pseudo: "assets/audio/intro.mp3",
  intro: "assets/audio/intro.mp3",
  game: "assets/audio/ambiance.mp3",
  victory: "assets/audio/victoire.mp3",
  defeat: "assets/audio/defaite.mp3"
};

// Initialisation audio pour le premier clic
export function initAudioOnUserGesture() {
  if (!currentAudio) {
    console.log("[DBG] initAudioOnUserGesture() appelé");
    // On peut précharger un son silencieux si besoin
    currentAudio = new Audio();
  }
}

// Jouer la musique d’un écran
export function playAudioForScreen(screenName) {
  const src = screenMusicMap[screenName];
  if (!src) {
    dwarn(`Aucune musique assignée pour l'écran ${screenName}`);
    return;
  }
  stopAllAudio();
  playMusic(src);
}

// Stop toutes les musiques en cours
export function stopAllAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

// Jouer une musique et la stocker dans currentAudio
function playMusic(src) {
  try {
    currentAudio = new Audio(src);
    currentAudio.loop = src === screenMusicMap["game"]; // loop uniquement pour l'ambiance jeu
    currentAudio.play().catch(e => {
      dwarn(`Impossible de jouer ${src}`, e);
    });
    console.log(`[DBG] playMusic(${src}) lancé`);
  } catch (e) {
    dwarn(`Erreur lecture audio ${src}`, e);
  }
}

// Effets sonores ponctuels
export function playActionEffect(effectName) {
  const effectsMap = {
    bonus: "assets/audio/bonus.mp3",
    error: "assets/audio/error.mp3"
  };
  const src = effectsMap[effectName];
  if (!src) {
    dwarn(`Effet audio inconnu : ${effectName}`);
    return;
  }
  const sfx = new Audio(src);
  sfx.play().catch(() => {});
}
