import { getPlayerName, debugLog, setScore, getScore } from "./state.js";
import { initAudioOnUserGesture, playActionEffect, stopAllAudio, switchToStressAmbience } from "./audio.js";

// Mini-jeux importés
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

let currentScreen = "pseudo";
let currentPuzzleIndex = 0;
let timerInterval = null;
let totalTime = 300; // 300s = 5min

// --- Changement d'écran ---
export function goToScreen(screenId) {
  debugLog(`➡️ Passage à l’écran : ${screenId}`);
  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  document.getElementById(screenId).classList.remove("hidden");
  currentScreen = screenId;

  if (screenId === "screen-victory" || screenId === "screen-defeat") {
    stopAllAudio();
  }
}

// --- Initialisation du router ---
export function initRouter() {
  goToScreen("screen-pseudo");

  const startBtn = document.getElementById("start-btn");
  startBtn.addEventListener("click", () => {
    const nameInput = document.getElementById("player-name");
    const name = nameInput.value.trim();
    if (!name) return alert("Merci de saisir ton nom !");
    getPlayerName(name);

    // Lancer l'ambiance
    initAudioOnUserGesture();

    goToIntro();
  });

  const beginGameBtn = document.getElementById("begin-game");
  beginGameBtn.addEventListener("click", () => startNextMiniGame());
}

// --- Intro ---
function goToIntro() {
  goToScreen("screen-intro");
  const introContent = document.getElementById("intro-content");
  introContent.textContent = "Le royaume oublié a besoin de toi ! Prépare-toi à relever les énigmes.";
}

// --- Lancer le prochain mini-jeu ---
export function startNextMiniGame() {
  if (currentPuzzleIndex >= puzzles.length) {
    endGame(true);
    return;
  }

  const puzzle = puzzles[currentPuzzleIndex];
  currentPuzzleIndex++;

  goToScreen("screen-game");

  const hudPlayer = document.getElementById("hud-player");
  hudPlayer.textContent = `Joueur : ${getPlayerName()}`;

  startTimer();

  puzzle.mount({
    meta: { title: `Énigme ${currentPuzzleIndex}` },
    onSolved: ({ score }) => {
      setScore(getScore() + score);
      playActionEffect("collect","bonus");
    },
    onFail: ({ penalty }) => {
      setScore(Math.max(0, getScore() - penalty));
      playActionEffect("error");
    }
  });
}

// --- Timer 5min ---
function startTimer() {
  clearInterval(timerInterval);
  totalTime = 300;
  const timerEl = document.getElementById("timer");
  timerInterval = setInterval(() => {
    totalTime--;
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    timerEl.textContent = `⏳ ${minutes}:${seconds.toString().padStart(2,'0')}`;

    if (totalTime === 300-240) { switchToStressAmbience(); } // à 60s ou 5min, switch si tu veux ici
    if (totalTime <= 0) {
      clearInterval(timerInterval);
      endGame(false);
    }
  }, 1000);
}

// --- Fin de partie ---
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
