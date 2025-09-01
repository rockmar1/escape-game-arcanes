import { dwarn } from "./debug.js";

let currentAudio = null;

export function initAudioOnUserGesture() {
  console.log("[DBG] initAudioOnUserGesture() appelé");
}

export function playAudioForScreen(screen) {
  const audios = {
    pseudo: "assets/audio/pseudo.mp3",
    intro: "assets/audio/intro.mp3",
    game: "assets/audio/ambiance.mp3",
    victory: "assets/audio/victoire.mp3",
    defeat: "assets/audio/defaite.mp3",
  };
  const src = audios[screen];
  if (!src) return;

  if (currentAudio) currentAudio.pause();
  currentAudio = new Audio(src);
  currentAudio.loop = screen === "game";
  currentAudio.play().catch(e => dwarn(`Impossible de jouer ${src}`, e));
}

export function stopAllAudio() {
  if (currentAudio) { currentAudio.pause(); currentAudio = null; }
}

export function switchToStressAmbience() {
  stopAllAudio();
  currentAudio = new Audio("assets/audio/ambiance_stress.mp3");
  currentAudio.loop = true;
  currentAudio.play().catch(e => dwarn("Impossible de jouer ambiance_stress.mp3", e));
}

export function playActionEffect(effect) {
  const effects = {
    bonus: "assets/audio/bonus.mp3",
    error: "assets/audio/error.mp3"
  };
  const src = effects[effect];
  if (!src) return dwarn("Effet audio inconnu :", effect);
  const audio = new Audio(src);
  audio.play().catch(() => {});
}
