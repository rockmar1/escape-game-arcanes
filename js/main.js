import { initRouter, goToScreen, startNextMiniGame } from "./router.js";
import { setPlayerName } from "./state.js";
import { dlog } from "./debug.js";
import "./admin.js"; 
import "./audio.js";

// =====================
// Initialisation
// =====================
document.addEventListener("DOMContentLoaded", () => {
  dlog("🎮 Initialisation du jeu...");

  initRouter();

  const startBtn = document.getElementById("start-btn");
  const beginBtn = document.getElementById("begin-game");
  const playerInput = document.getElementById("player-name");

  dlog(`✅ Boutons et input trouvés`);

  // Première interaction utilisateur -> audio global
  function firstClickHandler(){
    dlog("🖱️ Premier clic utilisateur détecté -> initAudioOnUserGesture()");
    document.removeEventListener("click", firstClickHandler);
    try { initAudioOnUserGesture(); } catch(e){ dlog("Erreur initAudioOnUserGesture()", e); }
  }
  document.addEventListener("click", firstClickHandler, {once:true});

  // Bouton Commencer
  startBtn.addEventListener("click", () => {
    const name = playerInput.value.trim();
    if(!name){
      alert("Entre un pseudo pour commencer !");
      return;
    }
    setPlayerName(name);
    dlog(`✅ Pseudo validé : ${name}`);
    document.getElementById("intro-content").textContent =
      `Bienvenue ${name}, le royaume t’attend...`;
    goToScreen("intro");
  });

  // Bouton Entrer dans le royaume
  beginBtn.addEventListener("click", () => {
    dlog("🖱️ Clic sur #begin-game -> début aventure");
    goToScreen("game");
    startNextMiniGame();
  });
});
