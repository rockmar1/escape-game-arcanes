// router.js
import { dlog } from "./debug.js";
import { gameState } from "./state.js";
import { playIntro } from "./intro.js";
import { startNextMiniGame } from "./main.js";

export function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  const el = document.querySelector(id);
  if (el) el.classList.remove("hidden");
  dlog("Écran affiché :", id);
}

export function initRouter() {
  dlog("initRouter -> affichage écran pseudo");
  showScreen("#screen-pseudo");
}

export function startGame() {
  dlog("startGame lancé");
  showScreen("#screen-intro");
  playIntro(0);

  // après 3s → mini-jeu
  setTimeout(() => {
    startNextMiniGame();
  }, 3000);
}

export function endGame(victory) {
  dlog("endGame appelé — victory:", victory);
  gameState.victory = victory;
  if (victory) {
    showScreen("#screen-victory");
  } else {
    showScreen("#screen-defeat");
  }

  setTimeout(() => {
    showScreen("#screen-scoreboard");
  }, 2000);
}

export function resetGame() {
  dlog("resetGame appelé");
  gameState.currentMiniGame = 0;
  gameState.victory = null;
  showScreen("#screen-pseudo");
}
