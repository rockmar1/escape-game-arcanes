import { dlog, dwarn } from "./debug.js";
import { getPlayerName, setScore, getScore } from "./state.js";
import { 
  initAudioOnUserGesture,
  playActionEffect,
  stopAllAudio,
  switchToStressAmbience,
  switchToNormalAmbience
} from "./audio.js";

import * as puzzleClock from "./puzzles/puzzleClock.js";
import * as puzzleCrystals from "./puzzles/puzzleCrystals.js";
// ... autres puzzles

const puzzles = [puzzleClock, puzzleCrystals]; // ... complète la liste

let currentPuzzleIndex = 0;
let timerInterval = null;
let remaining = 0;
let timerRunning = false;

export function goToScreen(screenName) {
  const all = document.querySelectorAll(".screen");
  all.forEach(s => s.classList.add("hidden"));

  const screenEl = document.getElementById("screen-" + screenName);
  if (!screenEl) {
    dwarn("Écran introuvable :", screenName);
    return;
  }
  screenEl.classList.remove("hidden");

  // Audio selon écran
  if (screenName === "intro") {
    if (currentPuzzleIndex === 0) {
      initAudioOnUserGesture();
    }
  } else if (screenName === "game") {
    switchToNormalAmbience();
  } else if (screenName === "victory" || screenName === "defeat") {
    stopAllAudio();
    new Audio(screenName==="victory"?"assets/audio/victoire.mp3":"assets/audio/defaite.mp3").play().catch(()=>{});
  }
}

export function initRouter() {
  document.getElementById("hud").style.display = "none";
  goToScreen("pseudo");
}

export function startTimer(totalSeconds = 600) {
  if (timerRunning) return;
  remaining = totalSeconds;
  timerRunning = true;
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    remaining--;
    updateTimerDisplay();
    if (remaining === 300) switchToStressAmbience();
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
  const m = Math.floor(remaining/60);
  const s = remaining % 60;
  el.textContent = `⏳ ${m}:${s.toString().padStart(2,"0")}`;
}

export function startNextMiniGame() {
  if (!document.getElementById("puzzle-container")) {
    dwarn("Aucun container pour le puzzle !");
    return;
  }
  if (currentPuzzleIndex >= puzzles.length) return endGame(true);

  const puzzleModule = puzzles[currentPuzzleIndex++];
  puzzleModule.mount({
    container: document.getElementById("puzzle-container"),
    onSolved: ({score}= {}) => {
      setScore(getScore() + (score||0));
      document.getElementById("puzzle-container").innerHTML = "";
      startNextMiniGame();
    },
    onFail: ({penalty}={})=>{
      setScore(Math.max(0,getScore()-(penalty||0)));
      document.getElementById("puzzle-container").innerHTML = "";
      startNextMiniGame();
    }
  });
}

export function endGame(victory=true) {
  clearInterval(timerInterval);
  stopAllAudio();
  goToScreen(victory?"victory":"defeat");
}

export function resetGame() {
  currentPuzzleIndex = 0;
  setScore(0);
  document.getElementById("hud").style.display = "none";
  document.getElementById("puzzle-container").innerHTML = "";
  goToScreen("pseudo");
}
