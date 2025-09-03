import { goToScreen } from './router.js';
import { initPlumeAnimations } from './plume.js';
import { startNextMiniGame } from './main.js'; // exporté à la fin du fichier

let currentPuzzleIndex = 0;
const puzzles = [/* ... tes puzzles ... */];

export function startNextMiniGame() {
  console.log('[DBG] startNextMiniGame appelé');

  if (currentPuzzleIndex >= puzzles.length) {
    console.log('[DBG] Tous les puzzles terminés -> victoire');
    goToScreen('victory');
    return;
  }

  const puzzleModule = puzzles[currentPuzzleIndex];
  currentPuzzleIndex++;

  goToScreen('game');

  if (!puzzleModule || typeof puzzleModule.mount !== 'function') {
    console.warn(`[WARN] Puzzle invalide index ${currentPuzzleIndex - 1}`);
    setTimeout(startNextMiniGame, 300);
    return;
  }

  puzzleModule.mount({
    onSolved: () => {
      console.log(`[DBG] Puzzle résolu #${currentPuzzleIndex}`);
      setTimeout(startNextMiniGame, 250);
    },
    onFail: () => {
      console.log(`[DBG] Puzzle échoué #${currentPuzzleIndex}`);
      setTimeout(startNextMiniGame, 250);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const hud = document.getElementById('hud');
  if (hud) hud.style.display = 'none';

  goToScreen('pseudo');

  document.getElementById('start-btn').addEventListener('click', () => {
    const pseudo = document.getElementById('pseudo-input').value.trim();
    if (!pseudo) return alert('Veuillez entrer un pseudo');

    console.log(`[DBG] player name ${pseudo}`);

    goToScreen('intro');
    initPlumeAnimations(() => {
      if (hud) hud.style.display = 'flex';
      startNextMiniGame();
    });
  });
});
