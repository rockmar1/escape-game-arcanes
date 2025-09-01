import { initRouter, goToScreen, startNextMiniGame } from "./router.js";
import { setPlayerName } from "./state.js";
import { dlog, dwarn } from "./debug.js";
import "./admin.js";
import "./audio.js";

document.addEventListener("DOMContentLoaded", () => {
  dlog("🎮 Initialisation du jeu...");

  initRouter();

  const startBtn = document.getElementById("start-btn");
  const beginBtn = document.getElementById("begin-game");
  const playerInput = document.getElementById("player-name");

  let audioInitialized = false;

  // Premier clic utilisateur -> init audio global
  document.body.addEventListener("click", () => {
    if (!audioInitialized) {
      dlog("🖱️ Premier clic utilisateur détecté -> initAudioOnUserGesture()");
      import("./audio.js").then(m => { m.initAudioOnUserGesture(); audioInitialized = true; });
    }
  }, { once: true });

  // Entrer le pseudo
  startBtn.addEventListener("click", () => {
    const name = playerInput.value.trim();
    if (!name) {
      alert("Entre un pseudo pour commencer !");
      return;
    }
    dlog(`🖱️ Clic sur #start-btn\nPseudo saisi: ${name}`);

    // Désactiver bouton pour éviter double clic
    startBtn.disabled = true;

    setPlayerName(name);
    goToScreen("intro");
    document.getElementById("intro-content").textContent = `Bienvenue ${name}, le royaume t’attend...`;

    try { import("./audio.js").then(m => m.playAudioForScreen("intro")); } 
    catch(e){ dwarn("playAudioForScreen() failed:", e); }
  });

  // Lancer le jeu après l’intro
  beginBtn.addEventListener("click", () => {
    dlog("🖱️ Clic sur #begin-game -> début aventure");
    goToScreen("game");
    startNextMiniGame();
  });
});
