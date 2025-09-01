import { dlog, dwarn, derr } from "./debug.js";
import { getPlayerName, setScore, getScore } from "./state.js";
import { 
  initAudioOnUserGesture, 
  playAudioForScreen, 
  switchToStressAmbience, 
  stopAllAudio 
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

// État du jeu
let currentPuzzleIndex = 0;
let timerInterval = null;
let remaining = 0;
let timerRunning = false;

// Temps total et seuil stress (secondes)
const TOTAL_TIME = 600; // 10min
const STRESS_THRESHOLD = 300; // 5min

dlog("router.js chargé");

// -----------------------------
// Navigation d'écrans
// -----------------------------
export function goToScreen(screenName) {
  const allScreens = document.querySelectorAll(".screen");
  allScreens.forEach(s => s.classList.add("hidden"));

  const screenEl = document.getElementById(`screen-${screenName}`);
  if (!screenEl) {
    derr(`Écran introuvable: screen-${screenName}`);
    return;
  }
  screenEl.classList.remove("hidden");
  dlog(`goToScreen -> ${screenName}`);

  // Gestion audio
  playAudioForScreen(screenName);

  // HUD visible uniquement après l'intro
  const hud = document.getElementById("hud");
  if (hud) {
    hud.style.display = (screenName === "game") ? "flex" : "none";
  }
}

// -----------------------------
// Initialisation
// -----------------------------
export function initRouter() {
  dlog("initRouter -> écran pseudo");
  goToScreen("pseudo");
}

// -----------------------------
// Timer
// -----------------------------
export function startTimer(totalSeconds = TOTAL_TIME) {
  if (timerRunning) return;

  remaining = totalSeconds;
  timerRunning = true;

  const timerEl = document.getElementById("timer");
  if (!timerEl) {
    dwarn("Aucun élément #timer trouvé");
    return;
  }

  function updateTimer() {
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    timerEl.textContent = `⏳ ${minutes}:${String(seconds).padStart(2,"0")}`;

    // Couleur et clignotement
    if (remaining <= 60) {
      timerEl.style.color = remaining % 2 === 0 ? "red" : "white";
    } else if (remaining <= STRESS_THRESHOLD) {
      timerEl.style.color = "red";
    }

    remaining--;
    if (remaining < 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      endGame(false);
    } else if (remaining === STRESS_THRESHOLD) {
      switchToStressAmbience();
    }
  }

  updateTimer();
  timerInterval = setInterval(updateTimer, 1000);
  dlog(`Timer démarré: ${totalSeconds}s`);
}

// -----------------------------
// Mini-jeux
// -----------------------------
export function startNextMiniGame() {
  if (!timerRunning) {
    startTimer();
    initAudioOnUserGesture();
  }

  if (currentPuzzleIndex >= puzzles.length) {
    dlog("Tous les puzzles terminés -> victoire");
    return endGame(true);
  }

  // Nettoyage écran précédent
  const gameContainer = document.getElementById("game-container");
  if (gameContainer) gameContainer.innerHTML = "";

  const puzzleModule = puzzles[currentPuzzleIndex];
  currentPuzzleIndex++;

  dlog(`Mount puzzle #${currentPuzzleIndex}`);
  if (!puzzleModule || typeof puzzleModule.mount !== "function") {
    dwarn(`Puzzle invalide à l'index ${currentPuzzleIndex - 1}`);
    setTimeout(startNextMiniGame, 300);
    return;
  }

  puzzleModule.mount({
    container: gameContainer,
    meta: { title: `Énigme ${currentPuzzleIndex}` },
    onSolved: ({ score } = {}) => {
      dlog(`Puzzle résolu (+${score||0})`);
      setScore(getScore() + (score||0));
      setTimeout(startNextMiniGame, 250);
    },
    onFail: ({ penalty } = {}) => {
      dlog(`Puzzle échoué (-${penalty||0})`);
      setScore(Math.max(0,getScore() - (penalty||0)));
      setTimeout(startNextMiniGame, 250);
    }
  });
}

// -----------------------------
// Fin de partie
// -----------------------------
export function endGame(victory = true) {
  clearInterval(timerInterval);
  timerRunning = false;
  stopAllAudio();

  // Choix aléatoire de fin
  const endings = victory ? ["victory", "victory2"] : ["defeat", "defeat2"];
  const screen = endings[Math.floor(Math.random() * endings.length)];
  goToScreen(screen);
}

// -----------------------------
// Reset jeu
// -----------------------------
export function resetGame() {
  currentPuzzleIndex = 0;
  setScore(0);
  clearInterval(timerInterval);
  timerRunning = false;
  stopAllAudio();
  goToScreen("pseudo");
}
