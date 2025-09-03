import { log } from "./debug.js";
import { playMusic, stopAllMusic, switchToStressAmbience } from "./audio.js";
import { startTimer, stopTimer, resetTimer } from "./timer.js";
import { puzzles } from "./state.js";
import { playIntro } from "./intro.js";

let currentPuzzleIndex = 0;

// === Navigation entre les écrans ===
export function goToScreen(screen) {
  document.querySelectorAll(".screen").forEach(el => el.style.display = "none");

  const target = document.getElementById(`screen-${screen}`);
  if (target) {
    target.style.display = "block";
    log(`Écran affiché : #screen-${screen}`);
  } else {
    log(`⚠️ écran ${screen} introuvable`);
  }

  // Gestion HUD
  const hud = document.getElementById("hud");
  if (!hud) return;
  if (screen === "game") {
    hud.style.display = "flex";
  } else {
    hud.style.display = "none";
  }

  // Gestion musiques
  stopAllMusic();
  if (["intro", "game", "victory", "defeat"].includes(screen)) {
    playMusic(screen);
  }
}

// === Initialisation Router ===
export function initRouter() {
  log("initRouter -> affichage écran pseudo");
  goToScreen("pseudo");

  // Bouton start pseudo
  const btnStart = document.getElementById("start-btn");
  if (btnStart) {
    btnStart.addEventListener("click", () => {
      const pseudoInput = document.getElementById("pseudo-input");
      const pseudo = pseudoInput?.value.trim() || "Joueur";
      log(`Pseudo validé : ${pseudo}`);
      goToScreen("intro");
      playIntro();
    });
  }

  // Bouton rejouer
  const btnReplay = document.querySelectorAll(".btn-replay");
  btnReplay.forEach(btn =>
    btn.addEventListener("click", () => {
      resetGame();
    })
  );
}

// === Lancer l’aventure après intro ===
export function startAdventure() {
  log("Début de l’aventure");
  goToScreen("game");
  resetTimer(600);
  startTimer();
  currentPuzzleIndex = 0;
  startNextPuzzle();
}

// === Gestion des puzzles ===
function startNextPuzzle() {
  if (currentPuzzleIndex >= puzzles.length) {
    endGame(true);
    return;
  }

  const puzzle = puzzles[currentPuzzleIndex];
  log(`Mount puzzle: ${puzzle.title}`);

  const container = document.getElementById("game-container");
  if (!container) {
    log("⚠️ game-container introuvable");
    return;
  }

  container.innerHTML = "";
  puzzle.mount(container, () => {
    log(`Puzzle résolu: ${puzzle.title}`);
    currentPuzzleIndex++;
    setTimeout(() => startNextPuzzle(), 1000);
  });
}

// === Fin du jeu ===
export function endGame(victory = false) {
  stopTimer();
  stopAllMusic();
  log(`endGame appelé — victory: ${victory}`);

  if (victory) {
    goToScreen("victory");
  } else {
    goToScreen("defeat");
  }

  setTimeout(() => {
    goToScreen("scoreboard");
  }, 4000);
}

// === Reset jeu ===
export function resetGame() {
  log("resetGame appelé");
  stopTimer();
  stopAllMusic();
  goToScreen("pseudo");
}
