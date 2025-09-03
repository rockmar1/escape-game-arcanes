// router.js
import { gameState } from "./state.js";
import { playMusic, stopAllMusic } from "./audio.js";
import { startNextMiniGame } from "./main.js";

export function goToScreen(screenName) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(s => s.classList.add('hidden'));

  const screenEl = document.getElementById(`screen-${screenName}`);
  if (!screenEl) {
    console.warn(`Écran introuvable : ${screenName}`);
    return;
  }

  screenEl.classList.remove('hidden');
  console.log(`[DBG] goToScreen -> ${screenName}`);
}
