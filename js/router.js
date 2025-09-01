// router.js
import { dlog, dwarn } from "./debug.js";
import { playAudioForScreen, stopAllAudio, switchToStressAmbience } from "./audio.js";
import { resetGame } from "./state.js";

let currentScreen = null;
let timerInterval = null;
let timeLeft = 600; // 10 minutes

// Liste des puzzles
const puzzles = [
  { id: "puzzle1", title: "Énigme 1" },
  { id: "puzzle2", title: "Énigme 2" },
  { id: "puzzle3", title: "Énigme 3" },
  { id: "puzzle4", title: "Énigme 4" },
  { id: "puzzle5", title: "Énigme 5" },
  { id: "puzzle6", title: "Énigme 6" },
  { id: "puzzle7", title: "Énigme 7" }
];
let currentPuzzleIndex = 0;

// --------- NAVIGATION ENTRE LES ÉCRANS ---------
export function goToScreen(screenId) {
  dlog("goToScreen -> " + screenId);

  // Cacher tous les écrans
  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));

  // Afficher l’écran choisi
  const target = document.getElementById("screen-" + screenId);
  if (target) {
    target.classList.remove("hidden");
    currentScreen = screenId;

    // Musique liée à l’écran
    stopAllAudio();
    playAudioForScreen(screenId);

    // Affichage HUD uniquement en jeu
    const hud = document.getElementById("hud");
    if (hud) {
      hud.style.display = screenId === "game" ? "flex" : "none";
    }

    // Cas particuliers
    if (screenId === "game") {
      startTimer(600);
      startNextMiniGame();
    }
  }
}

// --------- TIMER ---------
function startTimer(duration) {
  clearInterval(timerInterval);
  timeLeft = duration;

  const hudTimer = document.getElementById("hud-timer");
  hudTimer.textContent = formatTime(timeLeft);
  hudTimer.classList.remove("red", "blink");

  timerInterval = setInterval(() => {
    timeLeft--;

    if (hudTimer) {
      hudTimer.textContent = formatTime(timeLeft);

      if (timeLeft <= 60) {
        hudTimer.classList.add("blink");
      } else if (timeLeft <= 300) {
        hudTimer.classList.add("red");
        switchToStressAmbience();
      }
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame(false);
    }
  }, 1000);

  dlog("Timer démarré (" + duration + "s)");
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

// --------- MINI-JEUX ---------
function startNextMiniGame() {
  if (currentPuzzleIndex >= puzzles.length) {
    endGame(true);
    return;
  }

  const puzzle = puzzles[currentPuzzleIndex];
  dlog("Mount puzzle: " + puzzle.title);

  // Simuler résolution auto après 2 sec pour debug
  setTimeout(() => {
    dlog("Puzzle résolu: " + puzzle.title);
    currentPuzzleIndex++;
    startNextMiniGame();
  }, 2000);
}

// --------- FIN DE PARTIE ---------
export function endGame(victory) {
  clearInterval(timerInterval);
  if (victory) {
    goToScreen("victory");
  } else {
    goToScreen("defeat");
  }
}

export function restartGame() {
  clearInterval(timerInterval);
  resetGame();
  currentPuzzleIndex = 0;
  goToScreen("pseudo");
}

// --------- INIT ROUTER ---------
export function initRouter() {
  dlog("initRouter -> écran pseudo");
  goToScreen("pseudo");
}
