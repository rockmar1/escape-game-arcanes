import { initRouter, startAdventure } from "./router.js";
import { initAdminPanel } from "./admin.js";
import { initAudioOnUserGesture } from "./audio.js";
import { log } from "./debug.js";

// === Initialisation de l'app ===
document.addEventListener("DOMContentLoaded", () => {
  log("App start");

  // Init router & boutons
  initRouter();

  // Init panel admin
  initAdminPanel();

  // Première interaction utilisateur pour l'audio
  const firstClickHandler = () => {
    log("Premier clic -> initAudioOnUserGesture");
    initAudioOnUserGesture();
    document.removeEventListener("click", firstClickHandler);
  };
  document.addEventListener("click", firstClickHandler);

  // Bouton "Commencer l’aventure" après intro
  const btnBegin = document.getElementById("begin-game");
  if (btnBegin) {
    btnBegin.addEventListener("click", () => {
      startAdventure();
    });
  }
});
