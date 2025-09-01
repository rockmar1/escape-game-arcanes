import { initRouter, goToScreen, startNextMiniGame } from "./router.js";
import { setPlayerName, getPlayerName } from "./state.js";
import { initAdminPanel } from "./admin.js";
import { initAudioOnUserGesture } from "./audio.js";
import { dlog } from "./debug.js";

document.addEventListener("DOMContentLoaded", () => {
  dlog("🎮 Initialisation du jeu...");

  // Initialisation router et HUD
  initRouter();

  const startBtn = document.getElementById("start-btn");
  const beginBtn = document.getElementById("begin-game");
  const playerInput = document.getElementById("player-name");

  dlog("✅ Boutons et input trouvés");

  // Initialisation panel admin
  initAdminPanel();

  // Premier clic utilisateur pour activer audio
  document.body.addEventListener("click", firstClickHandler, { once: true });

  function firstClickHandler() {
    dlog("🖱️ Premier clic -> initAudioOnUserGesture()");
    initAudioOnUserGesture();
  }

  // Entrer le pseudo
  startBtn.addEventListener("click", () => {
    const name = playerInput.value.trim();
    if (!name) return alert("Entre un pseudo pour commencer !");
    setPlayerName(name);
    dlog(`✅ Pseudo validé : ${name}`);
    goToScreen("intro");
    document.getElementById("intro-content").textContent = `Bienvenue ${name}, le royaume t’attend...`;
  });

  // Lancer le jeu après l’intro
  beginBtn.addEventListener("click", () => {
    dlog("🖱️ Clic #begin-game -> startNextMiniGame()");
    goToScreen("game");
    startNextMiniGame();
  });
});
