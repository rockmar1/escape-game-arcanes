import { getPlayerName, debugLog, setScore, getScore } from "./state.js";
import { playAudio } from "./audio.js";

// Liste de tous les puzzles à jouer dans l’ordre
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

// --- Changement d'écran ---
export function goToScreen(screenId) {
  debugLog(`➡️ Passage à l’écran : ${screenId}`);
  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  document.getElementById(screenId).classList.remove("hidden");
  currentScreen = screenId;
  playAudio(screenId);
}

// --- Démarrage du router ---
export function initRouter() {
  goToScreen("screen-pseudo");

  // Bouton pseudo
  const startBtn = document.getElementById("start-btn");
  startBtn.addEventListener("click", () => {
    const nameInput = document.getElementById("player-name");
    const name = nameInput.value.trim();
    if (!name) return alert("Merci de saisir ton nom !");
    getPlayerName(name); // stocke le nom
    goToIntro();
  });

  // Bouton intro
  const beginGameBtn = document.getElementById("begin-game");
  beginGameBtn.addEventListener("click", () => {
    startNextMiniGame();
  });
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

  // Monte le puzzle et gère score + fin de puzzle
  puzzle.mount({
    meta: {title: `Énigme ${currentPuzzleIndex}`},
    onSolved: ({score}) => {
      setScore(getScore() + score);
    },
    onFail: ({penalty}) => {
      setScore(Math.max(0, getScore() - penalty));
    }
  });
}

// --- Fin de partie ---
export function endGame(victory = true) {
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
