let currentAudio = null;
let ambienceAudio = null;

// Initialise l'audio après un clic utilisateur
export function initAudioOnUserGesture() {
  if (ambienceAudio) return;
  ambienceAudio = new Audio("assets/audio/intro.mp3");
  ambienceAudio.loop = true;
  ambienceAudio.volume = 0.5;
  ambienceAudio.play().catch(()=>{});
}

// Jouer un effet ponctuel
export function playActionEffect(name) {
  const effects = {
    bonus: "assets/audio/bonus.mp3",
    error: "assets/audio/error.mp3"
  };
  if (!effects[name]) {
    console.warn("[WARN] Effet audio inconnu :", name);
    return;
  }
  const sfx = new Audio(effects[name]);
  sfx.play().catch(()=>{});
}

// Changer musique de fond stress
export function switchToStressAmbience() {
  if (ambienceAudio) {
    ambienceAudio.pause();
  }
  ambienceAudio = new Audio("assets/audio/ambiance_stress.mp3");
  ambienceAudio.loop = true;
  ambienceAudio.play().catch(()=>{});
}

// Revenir à musique normale
export function switchToNormalAmbience() {
  if (ambienceAudio) {
    ambienceAudio.pause();
  }
  ambienceAudio = new Audio("assets/audio/ambiance.mp3");
  ambienceAudio.loop = true;
  ambienceAudio.play().catch(()=>{});
}

// Stopper toutes musiques
export function stopAllAudio() {
  if (ambienceAudio) {
    ambienceAudio.pause();
    ambienceAudio = null;
  }
}
