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
  if (!all || all.length === 0) return derr("Aucun élément .screen trouvé");

  const screenEl = document.getElementById(id);
  if (!screenEl) return derr(`Écran introuvable : #${id}`);

  all.forEach(s => s.classList.add("hidden"));
  screenEl.classList.remove("hidden");

  // Jouer musique adaptée
  try { playAudioForScreen(screenName); } catch(e){ dwarn("Erreur playAudioForScreen:", e); }

  // Si victoire/défaite, arrêter toutes musiques
  if (screenName === "victory" || screenName === "defeat") {
    stopAllAudio();
    const jingle = screenName === "victory" ? "assets/audio/victoire.mp3" : "assets/audio/defaite.mp3";
    try { new Audio(jingle).play().catch(()=>{}); } catch(e){ }
  }
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
  if (timerRunning) return;

  remaining = totalSeconds;
  timerRunning = true;
  updateTimerDisplay();

  dlog(`Timer démarré (${totalSeconds}s)`);

  timerInterval = setInterval(() => {
    remaining--;
    updateTimerDisplay();

    if (totalSeconds > STRESS_THRESHOLD && remaining === STRESS_THRESHOLD) {
      switchToStressAmbience();
      const timerEl = document.getElementById("timer");
      if (timerEl) timerEl.classList.add("stress");
    }

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

// -----------------------------
// Mini-jeux / progression
// -----------------------------
let currentPuzzleModule = null;

export function startNextMiniGame() {
  if (!timerRunning) startTimer(DEFAULT_TOTAL_TIME);

  if (currentPuzzleIndex >= puzzles.length) return endGame(true);

  // Nettoyer l'écran de jeu avant de lancer le prochain
  const gameScreen = document.getElementById("screen-game");
  if (gameScreen) gameScreen.innerHTML = '<div id="hud"></div>'; // reset contenu

  const puzzleModule = puzzles[currentPuzzleIndex];
  currentPuzzleIndex++;
  currentPuzzleModule = puzzleModule;

  goToScreen("game");
  const hud = document.getElementById("hud-player");
  if (hud) hud.textContent = `👤 ${getPlayerName()}`;

  if (!puzzleModule || typeof puzzleModule.mount !== "function") {
    dwarn(`Puzzle invalide à l'index ${currentPuzzleIndex-1}`);
    setTimeout(() => startNextMiniGame(), 300);
    return;
  }

  puzzleModule.mount({
    meta: { title: `Énigme ${currentPuzzleIndex}` },
    onSolved: ({ score } = {}) => {
      setScore(getScore() + (score || 0));
      playActionEffect("bonus");
      currentPuzzleModule = null;
      setTimeout(() => startNextMiniGame(), 250);
    },
    onFail: ({ penalty } = {}) => {
      setScore(Math.max(0,getScore()-(penalty||0)));
      playActionEffect("error");
      currentPuzzleModule = null;
      setTimeout(() => startNextMiniGame(), 250);
    }
  });
}

// -----------------------------
// Fin / reset
// -----------------------------
export function endGame(victory=true) {
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
