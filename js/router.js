import { dlog, dwarn } from './debug.js';
import { playMusic, stopAllMusic } from './audio.js';
import { startTimer } from './timer.js';
import { initPlumeAnimations } from './plume.js';

let currentPuzzleIndex = 0;
let puzzles = []; // à remplir avec vos modules puzzles
let hud = null;

export function initRouter() {
  hud = document.getElementById('hud');
  if (hud) hud.style.display = 'none';
  goToScreen('pseudo');
  dlog('router.js chargé');
}

export function goToScreen(screenName) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('screen-' + screenName);
  if (!el) return dwarn('Écran introuvable', screenName);
  el.classList.add('active');
  dlog('Écran affiché:', `#screen-${screenName}`);

  stopAllMusic();

  if (screenName === 'intro') {
    playMusic('intro');
    if (hud) hud.style.display = 'none';
  } else if (screenName === 'game') {
    playMusic('game');
    if (hud) hud.style.display = 'flex';
  } else if (screenName === 'victory') playMusic('victory');
  else if (screenName === 'defeat') playMusic('defeat');
}

export function startNextMiniGame() {
  if (currentPuzzleIndex >= puzzles.length) return endGame(true);
  const puzzle = puzzles[currentPuzzleIndex];
  currentPuzzleIndex++;
  dlog('Mount puzzle:', puzzle.meta?.title || `#${currentPuzzleIndex}`);
  goToScreen('game');
  puzzle.mount({
    onSolved: () => startNextMiniGame(),
    onFail: () => startNextMiniGame()
  });
}

export function endGame(victory=true) {
  goToScreen(victory?'victory':'defeat');
}
