import { dlog, dwarn, derr } from "./debug.js";
import { getPlayerName, setScore, getScore } from "./state.js";
import {
  initAudioOnUserGesture,
  playAudioForScreen,
  stopAllAudio,
  switchToStressAmbience,
  switchToNormalAmbience
} from "./audio.js";

// --- Import des mini-jeux ---
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

// === État ===
let currentPuzzleIndex = 0;
let timerInterval = null;
let remaining = 0;
let timerRunning = false;
const DEFAULT_TOTAL_TIME = 600;
const STRESS_THRESHOLD = 300;

dlog("router.js chargé");

// -----------------------------
// Navigation d'écrans
// -----------------------------
export function goToScreen(screenName) {
  const id = "screen-" + screenName;
  dlog(`goToScreen("${screenName}") -> #${id}`);

  const all = document.querySelectorAll(".screen");
  if (!all || all.length === 0) return derr("Aucun élément .screen trouvé !");

  const screenEl = document.getElementById(id);
  if (!screenEl) return derr(`Écran introuvable : #${id}`);

  all.forEach(s => s.classList.add("hidden"));
  screenEl.classList.remove("hidden");

  // Jouer audio spécifique
  playAudioForScreen(screenName);

  // HUD visible seulement après intro
  const hud = document.getElementById("hud");
  if (screenName === "game" && hud) hud.classList.remove("hidden");
}

// -----------------------------
// Initialisation
// -----------------------------
export function initRouter() {
  dlog("initRouter() -> écran pseudo");
  goToScreen("pseudo");
}

// -----------------------------
// Timer
// -----------------------------
export function startTimer(totalSeconds = DEFAULT_TOTAL_TIME) {
  if (timerRunning) return dlog("Timer déjà en cours");

  remaining = totalSeconds;
  timerRunning = true;
  updateTimerDisplay();

  dlog(`Timer démarré (${totalSeconds}s)`);

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
  if (!el) return dwarn("Aucun élément #timer trouvé");
  const minutes = Math.floor(Math.max(0, remaining) / 60);
  const seconds = Math.max(0, remaining) % 60;
  el.textContent = `⏳ ${minutes}:${String(seconds).padStart(2,"0")}`;
}

// -----------------------------
// Mini-jeux
// -----------------------------
export function startNextMiniGame() {
  if (!timerRunning) startTimer(DEFAULT_TOTAL_TIME);

  if (currentPuzzleIndex >= puzzles.length) return endGame(true);

  const puzzleModule = puzzles[currentPuzzleIndex];
  currentPuzzleIndex++;

  goToScreen("game");

  // Nettoyer le container avant chaque puzzle
  const container = document.getElementById("puzzle-container");
  if (container) container.innerHTML = "";

  if (!puzzleModule || typeof puzzleModule.mount !== "function") {
    dwarn(`Module puzzle invalide #${currentPuzzleIndex}`);
    setTimeout(startNextMiniGame, 300);
    return;
  }

  puzzleModule.mount({
    container: container,
    meta: { title: `Énigme ${currentPuzzleIndex}` },
    onSolved: ({ score } = {}) => {
      setScore(getScore() + (score || 0));
      setTimeout(startNextMiniGame, 250);
    },
    onFail: ({ penalty } = {}) => {
      setScore(Math.max(0, getScore() - (penalty || 0)));
      setTimeout(startNextMiniGame, 250);
    }
  });
}

// -----------------------------
// Fin / reset
// -----------------------------
export function endGame(victory = true) {
  if (timerInterval) clearInterval(timerInterval);
  timerRunning = false;
  stopAllAudio();
  goToScreen(victory ? "victory" : "defeat");
}

export function resetGame() {
  currentPuzzleIndex = 0;
  if (timerInterval) clearInterval(timerInterval);
  timerRunning = false;
  setScore(0);
  switchToNormalAmbience();
  goToScreen("pseudo");
}
