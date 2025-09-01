import { initRouter, goToScreen, startNextMiniGame, startTimer, resetGame } from "./router.js";
import { setPlayerName, debugLog } from "./state.js";
import { dlog, derr, dwarn } from "./debug.js";
import { initAudioOnUserGesture, playAudioForScreen } from "./audio.js";
import "./admin.js"; // Panel admin

dlog("🎮 Initialisation du jeu...");

document.addEventListener("DOMContentLoaded", () => {
  // --- Initialisation écran pseudo ---
  initRouter();

  const startBtn = document.getElementById("start-btn");
  const beginBtn = document.getElementById("begin-game");
  const playerInput = document.getElementById("player-name");

  if (!startBtn || !beginBtn || !playerInput) {
    derr("Éléments HTML manquants : #start-btn, #begin-game, #player-name");
    return;
  }

  dlog("✅ Boutons et input trouvés");

  // --- Fonction utilitaire pour init audio + debug ---
  function firstUserInteraction() {
    dlog("🖱️ Premier clic utilisateur détecté -> initAudioOnUserGesture()");
    initAudioOnUserGesture();
    document.removeEventListener("click", firstUserInteraction);
    document.removeEventListener("keydown", firstUserInteraction);
  }

  document.addEventListener("click", firstUserInteraction);
  document.addEventListener("keydown", firstUserInteraction);

  // --- Clic sur "Commencer" ---
  startBtn.addEventListener("click", () => {
    dlog("🖱️ Clic sur #start-btn");

    const name = playerInput.value.trim();
    if (!name) {
      alert("Entre un pseudo pour commencer !");
      return;
    }
    setPlayerName(name);
    dlog(`✅ Pseudo validé : ${name}`);

    // Affichage intro
    goToScreen("intro");
    const introContent = document.getElementById("intro-content");
    if (introContent) introContent.textContent = `Bienvenue ${name}, le royaume t’attend...`;
    playAudioForScreen("intro");
  });

  // --- Clic sur "Entrer dans le royaume" ---
  beginBtn.addEventListener("click", () => {
    dlog("🖱️ Clic sur #begin-game -> début aventure");
    goToScreen("game");
    playAudioForScreen("game");
    startNextMiniGame(); // Lancer le premier mini-jeu et le timer
  });
});
