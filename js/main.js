import { initRouter, goToScreen, startNextMiniGame, resetGame } from "./router.js";
import { setPlayerName } from "./state.js";
import { initAdminPanel } from "./admin.js";
import { initAudioOnUserGesture } from "./audio.js";

document.addEventListener("DOMContentLoaded", () => {

  console.log("🎮 Initialisation du jeu...");

  // === Router et audio ===
  initRouter();

  // === HUD et boutons ===
  const startBtn = document.getElementById("start-btn");
  const beginBtn = document.getElementById("begin-game");
  const playerInput = document.getElementById("player-name");

  startBtn.addEventListener("click", () => {
    const name = playerInput.value.trim();
    if (!name) return alert("Entrez un pseudo !");
    setPlayerName(name);
    console.log("✅ Pseudo validé :", name);
    goToScreen("intro");
  });

  beginBtn.addEventListener("click", () => {
    console.log("🚀 Début de l’aventure");
    goToScreen("game");
    startNextMiniGame();
  });

  // === Premier clic utilisateur ===
  let firstClick = false;
  document.addEventListener("click", () => {
    if (!firstClick) {
      firstClick = true;
      console.log("🖱️ Premier clic -> initAudioOnUserGesture()");
      initAudioOnUserGesture();
    }
  }, { once: true });

  // === Panel admin ===
  initAdminPanel();

});
