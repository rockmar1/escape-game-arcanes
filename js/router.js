// router.js
import { playMusic, stopAllMusic } from './audio.js';

export function goToScreen(screenName) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(s => s.classList.add('hidden'));

  const screenEl = document.getElementById(`screen-${screenName}`);
  if (!screenEl) {
    console.warn(`[WARN] Écran introuvable: ${screenName}`);
    return;
  }

  screenEl.classList.remove('hidden');
  console.log(`[DBG] goToScreen -> ${screenName}`);

  // Gestion musique
  stopAllMusic();
  playMusic(screenName);
}
