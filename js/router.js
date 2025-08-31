// router.js
import { state, resetState } from "./state.js";
import { showScreen, updateHUD } from "./ui.js";
import { loadRandomPuzzle } from "./puzzles/loader.js";
import { saveScore } from "./scoreboard.js";

export function startGame() {
  resetState();
  showScreen("screen-intro");

  const introText = document.getElementById("intro-text");
  if (introText) {
    introText.textContent = `Bienvenue, ${state.playerName}. L'aventure commence...`;
  }

  const btn = document.getElementById("btn-begin");
  if (btn) {
    btn.onclick = () => {
      showScreen("screen-game");
      updateHUD();
      startTimer();
      loadRandomPuzzle();
    };
  }
}

export function endGame(type) {
  stopTimer();
  if (type === "victory") {
    showScreen("screen-victory");
    document.getElementById("victory-text").textContent =
      `${state.playerName}, tu as triomphé avec un score de ${state.score}!`;
  } else {
    showScreen("screen-defeat");
    document.getElementById("defeat-text").textContent =
      `${state.playerName}, ton aventure s'arrête ici... Score : ${state.score}`;
  }
  saveScore(state.playerName, state.score);
}

// Timer
let timerInterval = null;

function startTimer() {
  state.timer = 300;
  const el = document.getElementById("timer");
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    state.timer--;
    if (el) el.textContent = state.timer;
    if (state.timer <= 0) {
      clearInterval(timerInterval);
      endGame("defeat");
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;
}
