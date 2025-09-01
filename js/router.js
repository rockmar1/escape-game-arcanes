import { dlog, dwarn, derr } from "./debug.js";
import { getPlayerName, setScore, getScore } from "./state.js";
import { playAudioForScreen, stopAllAudio, switchToStressAmbience, initAudioOnUserGesture } from "./audio.js";

import * as puzzleClock from "./puzzles/puzzleClock.js";
import * as puzzleCrystals from "./puzzles/puzzleCrystals.js";
import * as puzzleLabyrinth from "./puzzles/puzzleLabyrinth.js";
import * as puzzlePotions from "./puzzles/puzzlePotions.js";
import * as puzzleRunes from "./puzzles/puzzleRunes.js";
import * as puzzleStars from "./puzzles/puzzleStars.js";
import * as puzzleTextInverse from "./puzzles/puzzleTextInverse.js";

const puzzles = [puzzleClock, puzzleCrystals, puzzleLabyrinth, puzzlePotions, puzzleRunes, puzzleStars, puzzleTextInverse];

let currentPuzzleIndex = 0;
let timerInterval = null;
let remaining = 0;
let timerRunning = false;

const DEFAULT_TOTAL_TIME = 600;
const STRESS_THRESHOLD = 300;

export function goToScreen(screen) {
  const id = "screen-" + screen;
  const all = document.querySelectorAll(".screen");
  all.forEach(s => s.classList.add("hidden"));
  const el = document.getElementById(id);
  if (el) el.classList.remove("hidden");

  playAudioForScreen(screen);

  if (screen === "victory" || screen === "defeat") stopAllAudio();
}

export function initRouter() {
  goToScreen("pseudo");
}

export function startTimer(totalSeconds = DEFAULT_TOTAL_TIME) {
  if (timerRunning) return;
  remaining = totalSeconds;
  timerRunning = true;
  updateTimerDisplay();

  timerInterval = setInterval(()=>{
    remaining--;
    updateTimerDisplay();

    if (remaining === STRESS_THRESHOLD) switchToStressAmbience();
    if (remaining <= 0) { clearInterval(timerInterval); timerRunning=false; endGame(false); }
  },1000);
}

function updateTimerDisplay() {
  const el = document.getElementById("timer");
  if (el) {
    const m = Math.floor(Math.max(0,remaining)/60);
    const s = Math.max(0,remaining)%60;
    el.textContent = `⏳ ${m}:${String(s).padStart(2,"0")}`;
    el.className = remaining <= STRESS_THRESHOLD ? "stress" : "";
  }
}

export function startNextMiniGame() {
  if (!timerRunning) startTimer(DEFAULT_TOTAL_TIME);

  if (currentPuzzleIndex >= puzzles.length) return endGame(true);

  const puzzleModule = puzzles[currentPuzzleIndex];
  currentPuzzleIndex++;
  goToScreen("game");

  if (!puzzleModule || typeof puzzleModule.mount !== "function") {
    dwarn(`Puzzle invalide index ${currentPuzzleIndex-1}`);
    return setTimeout(startNextMiniGame,300);
  }

  puzzleModule.mount({
    meta:{title:`Énigme ${currentPuzzleIndex}`},
    onSolved: ({score}= {})=>{
      setScore(getScore() + (score||0));
      setTimeout(()=>startNextMiniGame(),250);
    },
    onFail: ({penalty}= {})=>{
      setScore(Math.max(0,getScore() - (penalty||0)));
      setTimeout(()=>startNextMiniGame(),250);
    }
  });
}

export function endGame(victory=true) {
  if (timerInterval) { clearInterval(timerInterval); timerInterval=null; timerRunning=false; }
  stopAllAudio();
  goToScreen(victory?"victory":"defeat");
}

export function resetGame() {
  currentPuzzleIndex=0;
  if (timerInterval) { clearInterval(timerInterval); timerInterval=null; timerRunning=false; }
  setScore(0);
  goToScreen("pseudo");
}
