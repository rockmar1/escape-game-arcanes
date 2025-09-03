// router.js
import { playMusic, stopAllMusic, playSfx } from './audio.js';

let currentPuzzleIndex = 0;
let timerInterval = null;
let remaining = 600;
let timerRunning = false;

export function goToScreen(screenName) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(s => s.classList.add('hidden'));
  const screenEl = document.getElementById(`screen-${screenName}`);
  if (!screenEl) return console.warn(`[WARN] Écran introuvable: ${screenName}`);
  screenEl.classList.remove('hidden');
  console.log(`[DBG] goToScreen -> ${screenName}`);
}

// --- Mini-jeux ---
export function startNextMiniGame() {
  console.log(`[DBG] startNextMiniGame -> puzzle #${currentPuzzleIndex + 1}`);
  const hud = document.getElementById('hud');
  if (hud) hud.style.display = 'flex';

  goToScreen('game');
  playMusic('game');

  // Logique mini-jeu simulée (remplace par ton mount réel)
  setTimeout(() => {
    console.log(`[DBG] Puzzle résolu #${currentPuzzleIndex + 1}`);
    currentPuzzleIndex++;
    if (currentPuzzleIndex >= 7) endGame(true);
  }, 2000);
}

export function startTimer(totalSeconds = 600) {
  remaining = totalSeconds;
  timerRunning = true;
  timerInterval = setInterval(() => {
    remaining--;
    const el = document.getElementById('timer');
    if (el) {
      el.textContent = `${Math.floor(remaining/60)}:${String(remaining%60).padStart(2,'0')}`;
      if (remaining <= 5) el.style.color = 'red';
    }
    if (remaining <= 0) {
      clearInterval(timerInterval);
      endGame(false);
    }
  }, 1000);
}

export function endGame(victory = true) {
  stopAllMusic();
  goToScreen(victory ? 'victory' : 'defeat');
  playMusic(victory ? 'victory' : 'defeat');
}
