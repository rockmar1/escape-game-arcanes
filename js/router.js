import { playAudioForScreen, stopAllAudio, switchToStressAmbience } from "./audio.js";
import { setScore, getScore, getPlayerName } from "./state.js";

import * as puzzleClock from "./puzzles/puzzleClock.js";
import * as puzzleCrystals from "./puzzles/puzzleCrystals.js";
import * as puzzleLabyrinth from "./puzzles/puzzleLabyrinth.js";
import * as puzzlePotions from "./puzzles/puzzlePotions.js";
import * as puzzleRunes from "./puzzles/puzzleRunes.js";
import * as puzzleStars from "./puzzles/puzzleStars.js";
import * as puzzleTextInverse from "./puzzles/puzzleTextInverse.js";

const puzzles = [
  puzzleClock, puzzleCrystals, puzzleLabyrinth, puzzlePotions,
  puzzleRunes, puzzleStars, puzzleTextInverse
];

let currentPuzzleIndex = 0;
let timerInterval = null;
let remaining = 0;
let timerRunning = false;
const DEFAULT_TOTAL_TIME = 600;
const STRESS_THRESHOLD = 300;

export function goToScreen(screenName) {
  const all = document.querySelectorAll(".screen");
  all.forEach(s => s.classList.add("hidden"));
  const screenEl = document.getElementById("screen-" + screenName);
  if (screenEl) screenEl.classList.remove("hidden");

  if (screenName === "game") document.getElementById("hud").classList.remove("hidden");
  if (screenName === "intro") document.getElementById("hud").classList.add("hidden");

  playAudioForScreen(screenName);
}

export function initRouter() {
  console.log("[DBG] initRouter() -> écran pseudo");
  document.getElementById("hud").classList.add("hidden");
  goToScreen("pseudo");
}

export function startTimer(totalSeconds = DEFAULT_TOTAL_TIME) {
  if (timerRunning) return;
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
  if (!el) return;
  const minutes = Math.floor(Math.max(0, remaining)/60);
  const seconds = Math.max(0, remaining)%60;
  el.textContent = `⏳ ${minutes}:${String(seconds).padStart(2,"0")}`;
}

export function startNextMiniGame() {
  if (!timerRunning) startTimer(DEFAULT_TOTAL_TIME);
  if (currentPuzzleIndex >= puzzles.length) return endGame(true);

  const puzzle = puzzles[currentPuzzleIndex];
  const container = document.getElementById("game");
  if (!container) return console.warn("Aucun container pour", puzzle);

  currentPuzzleIndex++;
  container.innerHTML = ""; // supprime le précédent puzzle
  try {
    puzzle.mount({
      meta: { title: `Énigme ${currentPuzzleIndex}` },
      onSolved: ({score}={})=>{
        setScore(getScore() + (score||0));
        setTimeout(()=>startNextMiniGame(), 250);
      },
      onFail: ({penalty}={})=>{
        setScore(Math.max(0,getScore()-(penalty||0)));
        setTimeout(()=>startNextMiniGame(),250);
      }
    });
  } catch(e){console.error("Erreur mount puzzle", e);}
}

export function endGame(victory=true){
  if(timerInterval){ clearInterval(timerInterval); timerInterval=null; timerRunning=false; }
  stopAllAudio();
  goToScreen(victory?"victory":"defeat");
}

export function resetGame(){
  currentPuzzleIndex=0;
  if(timerInterval){ clearInterval(timerInterval); timerInterval=null; timerRunning=false; }
  setScore(0);
  stopAllAudio();
  goToScreen("pseudo");
}
