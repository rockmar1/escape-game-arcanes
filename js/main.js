import { initRouter } from './router.js';
import { initAudio } from './audio.js';
import { initAdmin } from './admin.js';
import { GameState } from './gameState.js';
import { showScreen } from './ui.js';

document.addEventListener("DOMContentLoaded", () => {
  console.debug("[DEBUG] Jeu lancé");

  initRouter();
  initAudio();
  initAdmin();

  GameState.reset();
  showScreen("screen-login");
});
