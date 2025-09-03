import { dlog } from "./debug.js";
import { goToScreen, startGame, resetGame, endGame } from "./router.js";
import { initAdmin } from "./admin.js";
import { initAudioOnUserGesture } from "./audio.js";

// === Initialisation générale ===
window.addEventListener("DOMContentLoaded", () => {
  dlog("App start");

  // Affiche l'écran pseudo par défaut
  goToScreen("pseudo");

  // Init admin panel
  initAdmin();

  // Forcer activation audio sur interaction
  initAudioOnUserGesture();

  // Bouton pseudo
  const pseudoForm = document.getElementById("pseudo-form");
  if (pseudoForm) {
    pseudoForm.addEventListener("submit", e => {
      e.preventDefault();
      const name = document.getElementById("pseudo-input").value.trim();
      if (name) {
        dlog(`player name ${name}`);
        startGame(name);
      }
    });
  }

  // Boutons rejouer
  document.querySelectorAll(".btn-restart").forEach(btn => {
    btn.addEventListener("click", () => {
      resetGame();
    });
  });

  // Boutons fin forcée (exemple debug)
  const forceWin = document.getElementById("btn-force-victory");
  if (forceWin) forceWin.addEventListener("click", () => endGame(true));

  const forceLose = document.getElementById("btn-force-defeat");
  if (forceLose) forceLose.addEventListener("click", () => endGame(false));
});
