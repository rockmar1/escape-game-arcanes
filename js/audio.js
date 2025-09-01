import { dlog, dwarn } from "./debug.js";

let currentAudio = null;
let stressAudio = null;

export function initAudioOnUserGesture() {
  dlog("initAudioOnUserGesture() appelé");
  // Optionnel : déclenchement global sur premier clic
}

// Arrête toute musique en cours
export function stopAllAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if (stressAudio) {
    stressAudio.pause();
    stressAudio = null;
  }
}

// Joue la musique correspondant à l’écran
export function playAudioForScreen(screenName) {
  stopAllAudio();
  const audioMap = {
    intro: "assets/audio/intro.mp3",
    game: "assets/audio/game.mp3",
    victory: "assets/audio/victoire.mp3",
    defeat: "assets/audio/defaite.mp3",
  };
  const src = audioMap[screenName];
  if (!src) {
    dwarn(`Aucune musique pour l'écran "${screenName}"`);
    return;
  }
  currentAudio = new Audio(src);
  currentAudio.loop = true;
  currentAudio.play().catch(err => dwarn(`Impossible de jouer ${src}`, err));
}

// Switch vers musique stress
export function switchToStressAmbience() {
  if (!currentAudio) return;
  currentAudio.pause();
  stressAudio = new Audio("assets/audio/ambiance_stress.mp3");
  stressAudio.loop = true;
  stressAudio.play().catch(err => dwarn("Impossible de jouer ambiance_stress.mp3", err));
}

// Effet ponctuel
export function playActionEffect(effectName) {
  const effects = {
    bonus: "assets/audio/bonus.mp3",
    error: "assets/audio/error.mp3"
  };
  const src = effects[effectName];
  if (!src) {
    dwarn(`Effet audio inconnu : ${effectName}`);
    return;
  }
  const effectAudio = new Audio(src);
  effectAudio.play().catch(()=>{});
}
