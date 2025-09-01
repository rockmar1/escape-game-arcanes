import { initRouter, goToScreen, startNextMiniGame, startTimer } from "./router.js";
import { setPlayerName } from "./state.js";
import { initAdminPanel } from "./admin.js";
import { initAudioOnUserGesture } from "./audio.js";

// =====================
// Initialisation
// =====================
document.addEventListener("DOMContentLoaded", () => {
  console.clear();
  console.log("🎮 Initialisation du jeu...");

  initRouter();
  initAdminPanel();

  const startBtn = document.getElementById("start-btn");
  const beginBtn = document.getElementById("begin-game");
  const nameInput = document.getElementById("player-name");

  // Premier clic utilisateur -> activer audio
  document.body.addEventListener("click", function firstClickHandler() {
    initAudioOnUserGesture();
    document.body.removeEventListener("click", firstClickHandler);
  });

  // Entrer le pseudo
  startBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    if (!name) {
      alert("Entre un pseudo pour commencer !");
      return;
    }
    setPlayerName(name);
    console.log(`✅ Pseudo validé : ${name}`);
    goToScreen("intro");
    document.getElementById("intro-content").textContent =
      `Bienvenue ${name}, le royaume t’attend...`;
  });

  // Lancer le jeu après l’intro
  beginBtn.addEventListener("click", () => {
    goToScreen("game");
    console.log("🚪 Début de l’aventure !");
    startNextMiniGame();
  });
});
