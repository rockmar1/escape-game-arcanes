import { initRouter, goToScreen } from "./router.js";
import { setPlayerName } from "./state.js";
import { debugLog } from "./state.js";
import "./admin.js"; // Active le panneau admin
import "./audio.js"; // Gère les sons globaux

// =====================
// Initialisation
// =====================
document.addEventListener("DOMContentLoaded", () => {
  debugLog("🎮 Initialisation du jeu...");

  initRouter();

  const startBtn = document.getElementById("start-btn");
  const beginBtn = document.getElementById("begin-game");

  // Entrer le pseudo
  startBtn.addEventListener("click", () => {
    const name = document.getElementById("player-name").value.trim();
    if (!name) {
      alert("Entre un pseudo pour commencer !");
      return;
    }
    setPlayerName(name);
    debugLog("✅ Pseudo validé : " + name);
    goToScreen("intro");
    document.getElementById("intro-content").textContent =
      `Bienvenue ${name}, le royaume t’attend...`;
  });

  // Lancer le jeu après l’intro
  beginBtn.addEventListener("click", () => {
    goToScreen("game");
    debugLog("🚪 Début de l’aventure !");
  });
});
