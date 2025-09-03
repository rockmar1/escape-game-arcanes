// main.js
import { initRouter, goToScreen, startNextMiniGame } from "./router.js";
import { initAdminPanel } from "./admin.js";
import { initPlumeAnimations } from "./plume.js";
import { dlog } from "./debug.js";
import { initAudioOnUserGesture } from "./audio.js";

document.addEventListener("DOMContentLoaded", () => {
  dlog("App start");

  initRouter();
  initAdminPanel();

  // Initialiser HUD masqué
  const hud = document.getElementById("hud");
  if (hud) hud.style.display = "none";

  // Premier clic -> activer audio
  document.body.addEventListener("click", async () => {
    await initAudioOnUserGesture();
    dlog("initAudioOnUserGesture done");
  }, { once: true });

  // Pseudo form
  const startBtn = document.getElementById("start-btn");
  const pseudoInput = document.getElementById("pseudo-input");
  startBtn?.addEventListener("click", () => {
    const name = pseudoInput.value.trim();
    if (!name) return alert("Entrez votre pseudo !");
    goToScreen("intro");

    // Lancer intro plume
    initPlumeAnimations().then(() => {
      hud.style.display = "block";
      startNextMiniGame();
    });
  });
});
