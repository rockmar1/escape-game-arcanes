// === router.js ===
import { stopAllMusic, playMusic } from "./audio.js";
import { gameState, resetState } from "./state.js";
import { startTimer, resetTimer } from "./timer.js";

export function goToScreen(name) {
  console.log(`[DBG] Écran affiché : #screen-${name}`);

  // cacher tous les écrans
  document.querySelectorAll(".screen").forEach(el => el.classList.add("hidden"));

  // afficher l'écran choisi
  const screen = document.getElementById(`screen-${name}`);
  if (screen) screen.classList.remove("hidden");

  // gérer musiques
  stopAllMusic();
  if (name === "intro") playMusic("intro");
  if (name === "game") playMusic("game");
  if (name === "victory") playMusic("victory");
  if (name === "defeat") playMusic("defeat");

  // logique spécifique
  if (name === "game") {
    resetTimer();
    startTimer(600); // 10 minutes
    document.getElementById("hud").classList.remove("hidden"); // afficher HUD
  }

  if (name === "pseudo") {
    document.getElementById("hud").classList.add("hidden"); // cacher HUD
  }
}

export function resetGame() {
  console.log("[DBG] resetGame appelé");
  resetState();
  resetTimer();
  goToScreen("pseudo");
}

export function endGame(victory = true) {
  console.log("[DBG] endGame appelé — victory:", victory);
  stopAllMusic();
  if (victory) {
    playMusic("victory");
    goToScreen("victory");
  } else {
    playMusic("defeat");
    goToScreen("defeat");
  }
}
