import { dlog, dwarn, derr } from "./debug.js";
import { getPlayerName, setScore, getScore } from "./state.js";
import {
  initAudioOnUserGesture,
  playActionEffect,
  stopAllAudio,
  switchToStressAmbience,
  switchToNormalAmbience,
  playAudioForScreen
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

// === État ===
let currentPuzzleIndex = 0;
let timerInterval = null;
let remaining = 0;
let timerRunning = false;
const DEFAULT_TOTAL_TIME = 600; // 10 min
const STRESS_THRESHOLD = 300;   // 5 min

dlog("router.js chargé");

// -----------------------------
// Navigation d'écrans
// -----------------------------
export function goToScreen(screenName) {
  const id = "screen-" + screenName;
  dlog(`goToScreen("${screenName}") -> #${id}`);
  const all = document.querySelectorAll(".screen");
  if (!all.length) return derr("Aucun élément .screen trouvé");
  const screenEl = document.getElementById(id);
  if (!screenEl) return derr(`Écran introuvable : #${id}`);
  all.forEach(s => s.classList.add("hidden"));
  screenEl.classList.remove("hidden");
  playAudioForScreen(screenName);

  if (screenName === "victory" || screenName === "defeat") {
    stopAllAudio();
    const jingle = screenName === "victory" ? "assets/audio/victoire.mp3" : "assets/audio/defaite.mp3";
    new Audio(jingle).play().catch(() => {});
  }
}

// -----------------------------
// Initialisation du router
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

  timerInterval = setInterval(() => {
    remaining--;
    updateTimerDisplay();

    if (remaining === STRESS_THRESHOLD) switchToStressAmbience();
    if (remaining <= 0) endGame(false);
  }, 1000);
}

function updateTimerDisplay() {
  const el = document.getElementById("timer");
  if (!el) return dwarn("Aucun #timer trouvé");
  const minutes = Math.floor(Math.max(0, remaining)/60);
  const seconds = Math.max(0, remaining)%60;
  el.textContent = `⏳ ${minutes}:${String(seconds).padStart(2,"0")}`;
  el.classList.toggle("stress", remaining <= STRESS_THRESHOLD);
}

// -----------------------------
// Mini-jeux / progression
// -----------------------------
export function startNextMiniGame() {
  const container = document.getElementById("game-container");
  if (!container) return derr("Aucun #game-container trouvé");
  container.innerHTML = ""; // Nettoie le mini-jeu précédent

  if (!timerRunning) startTimer(DEFAULT_TOTAL_TIME);

  if (currentPuzzleIndex >= puzzles.length) return endGame(true);

  const puzzleModule = puzzles[currentPuzzleIndex];
  currentPuzzleIndex++;
  goToScreen("game");

  if (!puzzleModule || typeof puzzleModule.mount !== "function") {
    dwarn(`Puzzle invalide index ${currentPuzzleIndex-1}`);
    setTimeout(startNextMiniGame, 300);
    return;
  }

  puzzleModule.mount({
    container,
    meta: { title: `Énigme ${currentPuzzleIndex}` },
    onSolved: ({ score }={}) => {
      setScore(getScore() + (score||0));
      playActionEffect("bonus");
      container.innerHTML = ""; // supprime le mini-jeu
      setTimeout(startNextMiniGame, 250);
    },
    onFail: ({ penalty }={}) => {
      setScore(Math.max(0,getScore()-(penalty||0)));
      playActionEffect("error");
      container.innerHTML = ""; // supprime le mini-jeu
      setTimeout(startNextMiniGame, 250);
    }
  });
}

// -----------------------------
// Fin / reset
// -----------------------------
export function endGame(victory=true) {
  if (timerInterval) { clearInterval(timerInterval); timerInterval=null; timerRunning=false; }
  stopAllAudio();
  goToScreen(victory ? "victory":"defeat");
}

export function resetGame() {
  currentPuzzleIndex = 0;
  if (timerInterval) { clearInterval(timerInterval); timerInterval=null; timerRunning=false; }
  setScore(0);
  switchToNormalAmbience();
  goToScreen("pseudo");
}
