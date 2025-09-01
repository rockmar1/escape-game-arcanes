import { dlog, dwarn } from "./debug.js";
import { getPlayerName, setScore, getScore } from "./state.js";
import {
  playAudioForScreen,
  switchToNormalAmbience,
  switchToStressAmbience,
  stopAllAudio
} from "./audio.js";

// Import des puzzles
import * as puzzleClock from "./puzzles/puzzleClock.js";
import * as puzzleCrystals from "./puzzles/puzzleCrystals.js";
import * as puzzleLabyrinth from "./puzzles/puzzleLabyrinth.js";
import * as puzzlePotions from "./puzzles/puzzlePotions.js";
import * as puzzleRunes from "./puzzles/puzzleRunes.js";
import * as puzzleStars from "./puzzles/puzzleStars.js";
import * as puzzleTextInverse from "./puzzles/puzzleTextInverse.js";

const puzzles = [
  puzzleClock,
  puzzleCrystals,
  puzzleLabyrinth,
  puzzlePotions,
  puzzleRunes,
  puzzleStars,
  puzzleTextInverse
];

// État
let currentPuzzleIndex = 0;
let currentPuzzleInstance = null;
let timerInterval = null;
let remaining = 0;
let timerRunning = false;

const DEFAULT_TOTAL_TIME = 600; // 10min
const STRESS_THRESHOLD = 300;   // 5min

console.log("[DBG] router.js chargé");

// ==============================
// Navigation d'écran
// ==============================
export function goToScreen(screenName) {
  const id = "screen-" + screenName;
  const all = document.querySelectorAll(".screen");
  if (!all.length) {
    dwarn("Aucun écran trouvé !");
    return;
  }
  const screenEl = document.getElementById(id);
  if (!screenEl) {
    dwarn(`Écran introuvable : #${id}`);
    return;
  }

  all.forEach(s => s.classList.add("hidden"));
  screenEl.classList.remove("hidden");
  playAudioForScreen(screenName);
}

// ==============================
// Initialisation router
// ==============================
export function initRouter() {
  goToScreen("pseudo");
}

// ==============================
// Timer global
// ==============================
export function startTimer(totalSeconds = DEFAULT_TOTAL_TIME) {
  if (timerRunning) return;

  remaining = totalSeconds;
  timerRunning = true;
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    remaining--;
    updateTimerDisplay();

    if (remaining === STRESS_THRESHOLD) switchToStressAmbience();
    if (remaining <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      endGame(false);
    }
  }, 1000);
}

function updateTimerDisplay() {
  const el = document.getElementById("timer");
  if (!el) return;
  const minutes = Math.floor(Math.max(0, remaining) / 60);
  const seconds = Math.max(0, remaining) % 60;
  el.textContent = `⏳ ${minutes}:${String(seconds).padStart(2,"0")}`;
}

// ==============================
// Mini-jeux
// ==============================
export function startNextMiniGame() {
  if (!timerRunning) startTimer(DEFAULT_TOTAL_TIME);

  if (currentPuzzleInstance) {
    // Nettoyer puzzle précédent
    currentPuzzleInstance.unmount?.();
    currentPuzzleInstance = null;
  }

  if (currentPuzzleIndex >= puzzles.length) return endGame(true);

  const puzzleModule = puzzles[currentPuzzleIndex];
  currentPuzzleIndex++;

  goToScreen("game");

  try {
    currentPuzzleInstance = puzzleModule.mount({
      meta: { title: `Énigme ${currentPuzzleIndex}` },
      onSolved: ({ score } = {}) => {
        setScore(getScore() + (score || 0));
        startNextMiniGame();
      },
      onFail: ({ penalty } = {}) => {
        setScore(Math.max(0, getScore() - (penalty || 0)));
        startNextMiniGame();
      }
    });
  } catch (e) {
    dwarn("Erreur mount puzzle:", e);
    startNextMiniGame();
  }
}

// ==============================
// Fin / reset
// ==============================
export function endGame(victory = true) {
  if (timerInterval) clearInterval(timerInterval);
  timerRunning = false;
  stopAllAudio();
  goToScreen(victory ? "victory" : "defeat");
}

export function resetGame() {
  currentPuzzleIndex = 0;
  if (currentPuzzleInstance?.unmount) currentPuzzleInstance.unmount();
  currentPuzzleInstance = null;
  setScore(0);
  switchToNormalAmbience();
  goToScreen("pseudo");
}
