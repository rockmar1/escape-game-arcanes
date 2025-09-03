import { dlog } from "./debug.js";
import { playMusic, stopAllMusic } from "./audio.js";
import { startIntro } from "./intro.js";
import { resetGameState, gameState } from "./state.js";
import { startTimer, resetTimer } from "./timer.js";

let currentScreen = null;

/**
 * Change d’écran (affiche un <div class="screen"> et cache les autres)
 */
export function goToScreen(id) {
  dlog(`Écran affiché : #screen-${id}`);

  // Cache tout
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));

  // Affiche l'écran voulu
  const screen = document.getElementById(`screen-${id}`);
  if (screen) {
    screen.classList.add("active");
    currentScreen = id;
  }

  // Musique
  stopAllMusic();
  playMusic(id);

  // Cas particuliers
  if (id === "intro") {
    startIntro(() => {
      // Quand l'intro est finie -> HUD visible + démarrer timer
      document.getElementById("hud").style.visibility = "visible";
      goToScreen("game");
      startTimer(600); // 10 minutes par défaut
    });
  }

  if (id === "victory" || id === "defeat") {
    // HUD masqué à la fin
    document.getElementById("hud").style.visibility = "hidden";
  }
}

/**
 * Lance une nouvelle partie
 */
export function startGame(playerName) {
  dlog(`startGame -> joueur: ${playerName}`);
  resetGameState(playerName);
  resetTimer();
  goToScreen("intro");
}

/**
 * Fin du jeu
 */
export function endGame(victory) {
  dlog(`endGame appelé — victory: ${victory}`);
  stopAllMusic();
  if (victory) {
    goToScreen("victory");
  } else {
    goToScreen("defeat");
  }
}

/**
 * Reset complet
 */
export function resetGame() {
  dlog("resetGame appelé");
  resetGameState();
  resetTimer();
  document.getElementById("hud").style.visibility = "hidden";
  goToScreen("pseudo");
}
