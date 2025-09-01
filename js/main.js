import { initRouter, goToScreen, startNextMiniGame } from "./router.js";
import { setPlayerName } from "./state.js";
import { dlog } from "./debug.js";
import { initAdminPanel } from "./admin.js";
import { initAudioOnUserGesture } from "./audio.js";

document.addEventListener("DOMContentLoaded", () => {
  dlog("🎮 Initialisation du jeu...");

  // Initialisation router
  initRouter();

  // Admin panel
  initAdminPanel();

  const startBtn = document.getElementById("start-btn");
  const beginBtn = document.getElementById("begin-game");

  // Premier clic utilisateur -> init audio
  document.body.addEventListener("click", function firstClickHandler(){
    initAudioOnUserGesture();
    document.body.removeEventListener("click", firstClickHandler);
  });

  // Entrer le pseudo
  startBtn.addEventListener("click", () => {
    const name = document.getElementById("player-name").value.trim();
    if (!name) { alert("Entre un pseudo pour commencer !"); return; }
    setPlayerName(name);
    dlog("✅ Pseudo validé : "+name);
    goToScreen("intro");
  });

  // Lancer le jeu après l’intro
  beginBtn.addEventListener("click", () => {
    document.getElementById("hud").classList.remove("hidden");
    startNextMiniGame();
  });

  // Recommencer
  const restartBtns = [document.getElementById("restart-btn"), document.getElementById("restart-btn-2")];
  restartBtns.forEach(btn => {
    if(btn) btn.addEventListener("click", () => location.reload());
  });
});
