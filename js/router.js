// router.js
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

export function goToScreen(screenName) {
  const id = "screen-" + screenName;
  dlog(`goToScreen("${screenName}") -> #${id}`);
  const all = document.querySelectorAll(".screen");
  if (!all.length) return derr("Aucun élément .screen trouvé !");
  const screenEl = document.getElementById(id);
  if (!screenEl) return derr(`Écran introuvable : #${id}`);
  all.forEach(s => s.classList.add("hidden"));
  screenEl.classList.remove("hidden");

  if(screenName !== "pseudo") {
    const hud = document.getElementById("hud");
    if(hud) hud.classList.remove("hidden");
  }

  playAudioForScreen(screenName);

  if(screenName === "victory" || screenName === "defeat") stopAllAudio();
}

export function initRouter() {
  dlog("initRouter() -> écran pseudo");
  goToScreen("pseudo");
}

export function startTimer(totalSeconds = DEFAULT_TOTAL_TIME) {
  if(timerRunning) return;
  remaining = totalSeconds;
  timerRunning = true;
  updateTimerDisplay();
  dlog(`Timer démarré (${totalSeconds}s)`);

  timerInterval = setInterval(() => {
    remaining--;
    updateTimerDisplay();

    if(remaining === STRESS_THRESHOLD) switchToStressAmbience();
    if(remaining <= 0) endGame(false);
  }, 1000);
}

function updateTimerDisplay() {
  const el = document.getElementById("timer");
  if(!el) return;
  const minutes = Math.floor(Math.max(0, remaining) / 60);
  const seconds = Math.max(0, remaining) % 60;
  el.textContent = `⏳ ${minutes}:${String(seconds).padStart(2,"0")}`;
}

let puzzleContainer = null;

export function startNextMiniGame() {
  if(!timerRunning) startTimer(DEFAULT_TOTAL_TIME);
  if(currentPuzzleIndex >= puzzles.length) return endGame(true);

  if(puzzleContainer) puzzleContainer.innerHTML = "";
  puzzleContainer = document.getElementById("game");
  const puzzleModule = puzzles[currentPuzzleIndex];
  currentPuzzleIndex++;

  if(!puzzleModule || typeof puzzleModule.mount !== "function") return dwarn("Puzzle invalide");

  puzzleModule.mount({
    container: puzzleContainer,
    meta: { title: `Puzzle ${currentPuzzleIndex}` },
    onSolved: ({score} = {}) => {
      setScore(getScore() + (score || 0));
      playActionEffect("bonus");
      puzzleContainer.innerHTML = "";
      startNextMiniGame();
    },
    onFail: ({penalty} = {}) => {
      setScore(Math.max(0,getScore()-(penalty||0)));
      playActionEffect("error");
      puzzleContainer.innerHTML = "";
      startNextMiniGame();
    }
  });
}

export function endGame(victory = true) {
  clearInterval(timerInterval);
  timerInterval = null;
  timerRunning = false;
  stopAllAudio();
  goToScreen(victory ? "victory" : "defeat");
}

export function resetGame() {
  clearInterval(timerInterval);
  timerInterval = null;
  timerRunning = false;
  currentPuzzleIndex = 0;
  setScore(0);
  stopAllAudio();
  switchToNormalAmbience();
  goToScreen("pseudo");
}

export function skipCurrentPuzzle() {
  if(puzzleContainer) puzzleContainer.innerHTML = "";
  startNextMiniGame();
}

export function revealPuzzleSolution() {
  if(puzzleContainer && puzzleContainer.querySelector(".solution")) {
    puzzleContainer.querySelector(".solution").style.display = "block";
  }
}
