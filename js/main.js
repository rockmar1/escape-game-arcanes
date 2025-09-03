// main.js
import { gameState } from "./state.js";
import { goToScreen } from "./router.js";
import { playMusic } from "./audio.js";
import { initPlumeAnimations } from "./plume.js";
import { startNextMiniGame } from "./main.js"; // si startNextMiniGame est ici

document.addEventListener('DOMContentLoaded', () => {
  const hud = document.getElementById('hud');
  if (hud) hud.style.display = 'none'; // Masqué par défaut

  goToScreen('pseudo');

  const startBtn = document.getElementById('start-btn');
  startBtn.addEventListener('click', () => {
    const pseudoInput = document.getElementById('pseudo-input');
    const pseudo = pseudoInput.value.trim();

    if (!pseudo) {
      alert("Veuillez entrer votre pseudo !");
      return;
    }

    // Stocker le pseudo
    gameState.playerName = pseudo;
    console.log(`[DBG] player name ${gameState.playerName}`);

    // Passer à l'intro
    goToScreen('intro');

    // Stop toutes les musiques précédentes
    stopAllMusic();

    // Lancer musique intro
    playMusic('intro');

    // Lancer animation plume
    initPlumeAnimations(() => {
      console.log('[DBG] Intro terminée');
      // Afficher HUD
      if (hud) hud.style.display = 'block';
      // Démarrer le premier mini-jeu
      startNextMiniGame();
    });
  });
});
