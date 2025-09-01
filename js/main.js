import { initRouter, goToScreen } from "./router.js";
import { setPlayerName } from "./state.js";
import { dlog, derr, dwarn } from "./debug.js";
import "./admin.js"; // Active le panneau admin
import "./audio.js"; // Gère les sons globaux

// =====================
// Initialisation
// =====================
document.addEventListener("DOMContentLoaded", () => {
  dlog("🎮 Initialisation du jeu...");

  initRouter();

  const startBtn = document.getElementById("start-btn");
  const beginBtn = document.getElementById("begin-game");

  if (!startBtn) {
    derr("⚠️ Bouton #start-btn introuvable dans le DOM !");
  } else {
    dlog("✅ Bouton #start-btn trouvé");
  }

  if (!beginBtn) {
    dwarn("⚠️ Bouton #begin-game introuvable (intro) !");
  } else {
    dlog("✅ Bouton #begin-game trouvé");
  }

  // Entrer le pseudo
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      dlog("🖱️ Clic sur #start-btn");
      const input = document.getElementById("player-name");
      if (!input) {
        derr("Champ #player-name introuvable !");
        return;
      }
      const name = input.value.trim();
      dlog("Pseudo saisi:", name || "(vide)");

      if (!name) {
        alert("Entre un pseudo pour commencer !");
        return;
      }

      setPlayerName(name);
      dlog("✅ Pseudo validé :", name);

      const introContent = document.getElementById("intro-content");
      if (introContent) {
        introContent.textContent = `Bienvenue ${name}, le royaume t’attend...`;
        dlog("Texte intro mis à jour.");
      } else {
        dwarn("⚠️ Élément #intro-content manquant.");
      }

      goToScreen("intro");
    });
  }

  // Lancer le jeu après l’intro
  if (beginBtn) {
    beginBtn.addEventListener("click", () => {
      dlog("🖱️ Clic sur #begin-game");
      goToScreen("game");
      dlog("🚪 Passage à l’écran de jeu !");
    });
  }
});
