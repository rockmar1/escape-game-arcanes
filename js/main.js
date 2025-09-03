// === main.js ===
import { goToScreen, resetGame } from "./router.js";
import { setPlayerName } from "./state.js";
import { initAdminPanel } from "./admin.js";
import { initAudioOnUserGesture } from "./audio.js";

console.log("[DBG] App start");

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  console.log("[DBG] initRouter -> affichage écran pseudo");
  goToScreen("pseudo");

  initAdminPanel();
  initAudioOnUserGesture();

  // pseudo
  const form = document.getElementById("pseudo-form");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const name = document.getElementById("pseudo-input").value.trim();
      if (name) {
        setPlayerName(name);
        console.log("[DBG] player name", name);
        goToScreen("intro");
      }
    });
  }

  // boutons reset
  document.querySelectorAll(".btn-reset").forEach(btn =>
    btn.addEventListener("click", () => resetGame())
  );
});
