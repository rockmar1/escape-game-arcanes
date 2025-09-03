import { initRouter, goToScreen, startNextMiniGame } from './router.js';
import { initPlumeAnimations } from './plume.js';
import { startTimer } from './timer.js';

document.addEventListener('DOMContentLoaded', () => {
  initRouter();

  const startBtn = document.getElementById('start-btn');
  startBtn.addEventListener('click', () => {
    const pseudo = document.getElementById('pseudo-input').value.trim();
    if (!pseudo) return alert('Entrez un pseudo !');
    dlog('player name', pseudo);

    goToScreen('intro');

    initPlumeAnimations(() => {
      const hud = document.getElementById('hud');
      if (hud) hud.style.display = 'flex';
      startTimer();
      startNextMiniGame();
    });
  });
});
