import { getPlayerName, setScore, getScore, debugLog } from "./state.js";
import { initAudioOnUserGesture, playActionEffect, stopAllAudio, switchToStressAmbience, switchToNormalAmbience } from "./audio.js";

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
let totalTime = 300; // 5 min

// === Changement d’écran ===
export function goToScreen(screenName) {
  const id = "screen-" + screenName;
  const screenEl = document.getElementById(id);
  if (!screenEl) {
    console.error(`Écran introuvable : ${id}`);
    return;
  }
  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  screenEl.classList.remove("hidden");

  if (screenName === "victory" || screenName === "defeat") {
    stopAllAudio();
  }
}

// === Initialisation du router ===
export function initRouter() {
  goToScreen("pseudo");
}

// === Lancer le prochain mini-jeu ===
export function startNextMiniGame() {
  if (currentPuzzleIndex >= puzzles.length) return endGame(true);

  const puzzle = puzzles[currentPuzzleIndex];
  currentPuzzleIndex++;

  goToScreen("game");
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

    if (totalTime === 300 / 60) { // 5 min ? Ici, tu peux adapter
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
    goToScreen("victory");
  } else {
    document.getElementById("defeat-text").textContent =
      `Hélas ${getPlayerName()}... le royaume s’effondre.`;
    goToScreen("defeat");
  }
  stopAllAudio();
}

// === Réinitialisation pour recommencer une partie ===
export function resetGame() {
  currentPuzzleIndex = 0;
  setScore(0);
  switchToNormalAmbience();
  goToScreen("pseudo");
}
