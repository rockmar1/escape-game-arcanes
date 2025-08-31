import { getPlayerName, setScore, getScore, debugLog } from "./state.js";
import { initAudioOnUserGesture, playActionEffect, stopAllAudio, switchToStressAmbience } from "./audio.js";

// Mini-jeux
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
let totalTime = 300; // 5min

// === Changement d’écran ===
export function goToScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");

  if (id === "screen-victory" || id === "screen-defeat") stopAllAudio();
}

// === Initialisation du router ===
export function initRouter() {
  goToScreen("screen-pseudo");

  const startBtn = document.getElementById("start-btn");
  const beginBtn = document.getElementById("begin-game");

  startBtn.addEventListener("click", () => {
    const name = document.getElementById("player-name").value.trim();
    if (!name) return alert("Entre un pseudo !");
    initAudioOnUserGesture();
    goToScreen("screen-intro");
    document.getElementById("intro-content").textContent =
      `Bienvenue ${name}, le royaume t’attend...`;
  });

  beginBtn.addEventListener("click", () => {
    startNextMiniGame();
  });
}

// === Lancer le prochain mini-jeu ===
export function startNextMiniGame() {
  if (currentPuzzleIndex >= puzzles.length) return endGame(true);

  const puzzle = puzzles[currentPuzzleIndex];
  currentPuzzleIndex++;

  goToScreen("screen-game");
  document.getElementById("hud-player").textContent = `👤 ${getPlayerName()}`;

  startTimer();

  puzzle.mount({
    meta: { title: `Énigme ${currentPuzzleIndex}` },
    onSolved: ({ score }) => {
      setScore(getScore() + score);
      playActionEffect("bonus");
      startNextMiniGame();
    },
    onFail: ({ penalty }) => {
      setScore(Math.max(0, getScore() - penalty));
      playActionEffect("error");
      startNextMiniGame();
    }
  });
}

// === Timer du jeu ===
function startTimer() {
  clearInterval(timerInterval);
  totalTime = 300;
  const timerEl = document.getElementById("timer");
  timerEl.classList.remove("stress");

  timerInterval = setInterval(() => {
    totalTime--;
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    timerEl.textContent = `⏳ ${minutes}:${seconds.toString().padStart(2,'0')}`;

    if (totalTime === 60) { // dernière minute, stress
      switchToStressAmbience();
      timerEl.classList.add("stress");
    }

    if (totalTime <= 0) {
      clearInterval(timerInterval);
      endGame(false);
    }
  }, 1000);
}

// === Fin de partie ===
export function endGame(victory = true) {
  clearInterval(timerInterval);
  if (victory) {
    document.getElementById("victory-text").textContent =
      `Bravo ${getPlayerName()} ! Score final : ${getScore()}`;
    goToScreen("screen-victory");
  } else {
    document.getElementById("defeat-text").textContent =
      `Hélas ${getPlayerName()}... le royaume s’effondre.`;
    goToScreen("screen-defeat");
  }
}

// === Réinitialisation pour recommencer une partie (optionnel) ===
export function resetGame() {
  currentPuzzleIndex = 0;
  setScore(0);
  goToScreen("screen-pseudo");
}
