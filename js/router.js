import { getPlayerName, setScore, getScore } from "./state.js";
import { dlog, dwarn, derr } from "./debug.js";
import { 
  playAudioForScreen, 
  stopAllAudio, 
  switchToStressAmbience, 
  switchToNormalAmbience, 
  playActionEffect 
} from "./audio.js";

// --- Puzzles import ---
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

let currentPuzzleIndex = 0;
let timerInterval = null;
let remaining = 0;
let timerRunning = false;

const DEFAULT_TOTAL_TIME = 600;
const STRESS_THRESHOLD = 300;

dlog("router.js chargé");

// -----------------------------
// Navigation écran
// -----------------------------
export function goToScreen(screenName) {
  const id = "screen-" + screenName;
  const all = document.querySelectorAll(".screen");
  all.forEach(s => s.classList.add("hidden"));
  const el = document.getElementById(id);
  if (!el) return derr(`Écran introuvable: #${id}`);
  el.classList.remove("hidden");
  playAudioForScreen(screenName);
  dlog(`Écran affiché : #${id}`);
}

// -----------------------------
// Init Router
// -----------------------------
export function initRouter() {
  goToScreen("pseudo");
}

// -----------------------------
// Timer
// -----------------------------
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
  if (!el) return dwarn("#timer introuvable");
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

  const container = document.getElementById("puzzle-container");
  if (!container) return derr("#puzzle-container introuvable");
  container.innerHTML = ""; // supprime ancien mini-jeu

  if (!puzzleModule || typeof puzzleModule.mount !== "function") {
    dwarn(`Puzzle #${currentPuzzleIndex-1} invalide`);
    setTimeout(() => startNextMiniGame(), 300);
    return;
  }

  puzzleModule.mount({
    meta: { title: `Énigme ${currentPuzzleIndex}` },
    container,
    onSolved: ({ score } = {}) => {
      setScore(getScore() + (score || 0));
      playActionEffect("bonus");
      startNextMiniGame();
    },
    onFail: ({ penalty } = {}) => {
      setScore(Math.max(0, getScore() - (penalty || 0)));
      playActionEffect("error");
      startNextMiniGame();
    }
  });
}

// -----------------------------
// Fin / Reset
// -----------------------------
export function endGame(victory=true) {
  clearInterval(timerInterval);
  timerRunning = false;
  stopAllAudio();
  goToScreen(victory ? "victory" : "defeat");
  const jingle = victory ? "assets/audio/victoire.mp3" : "assets/audio/defaite.mp3";
  new Audio(jingle).play().catch(()=>{});
}

export function resetGame() {
  currentPuzzleIndex = 0;
  clearInterval(timerInterval);
  timerRunning = false;
  setScore(0);
  switchToNormalAmbience();
  goToScreen("pseudo");
}
