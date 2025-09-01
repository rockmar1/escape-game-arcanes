import { initRouter, goToScreen, startNextMiniGame, resetGame } from "./router.js";
import { setPlayerName } from "./state.js";
import { initAdminPanel } from "./admin.js";
import { playAudioForScreen } from "./audio.js";
import { dlog, dwarn } from "./debug.js";

// =====================
// Initialisation
// =====================
document.addEventListener("DOMContentLoaded", () => {
  dlog("🎮 Initialisation du jeu...");

  // Initialisation router
  initRouter();

  // Initialisation panel admin
  initAdminPanel();

  // Boutons
  const startBtn = document.getElementById("start-btn");
  const beginBtn = document.getElementById("begin-game");

  if (!startBtn || !beginBtn) {
    dwarn("Boutons start ou begin non trouvés !");
    return;
  }

  // === Écran pseudo ===
  startBtn.addEventListener("click", () => {
    const name = document.getElementById("player-name").value.trim();
    if (!name) {
      alert("Entrez un pseudo pour commencer !");
      return;
    }
    setPlayerName(name);

    // Passage à l'intro
    goToScreen("intro");
    document.getElementById("intro-content").textContent = `Bienvenue ${name}, le royaume t’attend...`;

    // Jouer la musique d'intro
    playAudioForScreen("intro");
  });

  // === Écran intro -> début aventure ===
  beginBtn.addEventListener("click", () => {
    // Afficher HUD
    const hud = document.getElementById("hud");
    if (hud) hud.classList.remove("hidden");

    // Passage au jeu
    goToScreen("game");

    // Lancer premier mini-jeu
    startNextMiniGame();

    // Jouer musique de jeu
    playAudioForScreen("game");
  });
});
