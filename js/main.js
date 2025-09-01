import { initRouter, goToScreen, startNextMiniGame } from "./router.js";
import { setPlayerName } from "./state.js";
import { initAudioOnUserGesture } from "./audio.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("[DBG] 🎮 Initialisation du jeu...");

  // Initialisation router
  initRouter();

  const startBtn = document.getElementById("start-btn");
  const beginBtn = document.getElementById("begin-game");

  // Premier clic utilisateur pour débloquer audio
  let audioInitialized = false;
  function firstClickHandler() {
    if (!audioInitialized) {
      console.log("[DBG] 🖱️ Premier clic utilisateur -> initAudioOnUserGesture()");
      initAudioOnUserGesture();
      audioInitialized = true;
    }
  }
  document.addEventListener("click", firstClickHandler, { once: true });

  // Entrer pseudo
  startBtn.addEventListener("click", () => {
    const name = document.getElementById("player-name").value.trim();
    if (!name) {
      alert("Entre un pseudo pour commencer !");
      return;
    }
    setPlayerName(name);
    console.log("[DBG] ✅ Pseudo validé :", name);
    goToScreen("intro");
  });

  // Lancer le jeu après l’intro
  beginBtn.addEventListener("click", () => {
    document.getElementById("hud").classList.remove("hidden"); // afficher HUD
    goToScreen("game");
    startNextMiniGame();
  });
});
