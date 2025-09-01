import { initRouter, goToScreen, startNextMiniGame } from "./router.js";
import { setPlayerName } from "./state.js";
import { initAdminPanel } from "./admin.js";
import { initAudioOnUserGesture } from "./audio.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("[DBG] 🎮 Initialisation du jeu...");

  initRouter();
  initAdminPanel(); // panel admin

  const startBtn = document.getElementById("start-btn");
  const beginBtn = document.getElementById("begin-game");

  document.addEventListener("click", firstClickHandler, { once: true });

  function firstClickHandler() {
    console.log("[DBG] 🖱️ Premier clic -> initAudioOnUserGesture()");
    try { initAudioOnUserGesture(); } catch (e) { console.warn("initAudioOnUserGesture() failed", e); }
  }

  startBtn?.addEventListener("click", () => {
    const name = document.getElementById("player-name").value.trim();
    if (!name) { alert("Entre un pseudo pour commencer !"); return; }
    setPlayerName(name);
    console.log("[DBG] ✅ Pseudo validé :", name);
    goToScreen("intro");
  });

  beginBtn?.addEventListener("click", () => {
    console.log("[DBG] 🖱️ Clic #begin-game -> startNextMiniGame()");
    goToScreen("game");
    startNextMiniGame();
  });
});
