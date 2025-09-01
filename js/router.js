// router.js
import { dlog, dwarn, derr } from "./debug.js";
import { getPlayerName, setScore, getScore } from "./state.js";
import { 
  initAudioOnUserGesture,
  playAudioForScreen,
  stopAllAudio,
  playActionEffect,
  switchToStressAmbience
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

// ==========================
// État
// ==========================
let currentPuzzleIndex = 0;
let timerInterval = null;
let remainingTime = 0;
let timerRunning = false;

const DEFAULT_TOTAL_TIME = 600; // 10 minutes
const STRESS_THRESHOLD = 300;   // 5 minutes

dlog("router.js chargé");

// ==========================
// Navigation écrans
// ==========================
export function goToScreen(screenName) {
  const id = "screen-" + screenName;
  dlog(`goToScreen("${screenName}") demandé -> #${id}`);
  
  const allScreens = document.querySelectorAll(".screen");
  if (!allScreens || allScreens.length === 0) {
    derr("Aucun élément .screen trouvé !");
    return;
  }

  const screenEl = document.getElementById(id);
  if (!screenEl) {
    derr(`Écran introuvable : #${id}`);
    return;
  }

  allScreens.forEach(s => s.classList.add("hidden"));
  screenEl.classList.remove("hidden");
  dlog(`Écran affiché : #${id}`);

  // Audio pour écran
  try { playAudioForScreen(screenName); } catch (e) { dwarn("playAudioForScreen() failed:", e); }

  // Si écran victoire ou défaite, stop tout
  if (screenName === "victory" || screenName === "defeat") {
    try { stopAllAudio(); } catch(e) { dwarn("stopAllAudio() failed:", e); }
  }
}

// ==========================
// Initialisation
// ==========================
export function initRouter() {
  dlog("initRouter() -> affichage écran pseudo par défaut");
  goToScreen("pseudo");

  // Associer boutons
  const startBtn = document.getElementById("start-btn");
  const beginBtn = document.getElementById("begin-game");
  const playerInput = document.getElementById("player-name");

  if (!startBtn || !beginBtn || !playerInput) {
    derr("Éléments #start-btn, #begin-game ou #player-name introuvables !");
    return;
  }

  dlog("✅ Boutons et input trouvés");

  // Premier clic utilisateur pour init audio
  document.body.addEventListener("click", () => {
    dlog("🖱️ Premier clic utilisateur détecté -> initAudioOnUserGesture()");
    try { initAudioOnUserGesture(); } catch(e) { dwarn("initAudioOnUserGesture() failed:", e); }
  }, { once: true });

  // Start bouton pseudo
  startBtn.addEventListener("click", () => {
    const name = playerInput.value.trim();
    if (!name) { alert("Entre un pseudo !"); return; }
    dlog(`🖱️ Clic sur #start-btn\nPseudo saisi: ${name}`);
    window.playerName = name;
    document.getElementById("hud-player").textContent = `👤 ${name}`;
    goToScreen("intro");
    document.getElementById("intro-content").textContent = `Bienvenue ${name}, le royaume t’attend...`;
  });

  // Begin bouton intro
  beginBtn.addEventListener("click", () => {
    dlog("🖱️ Clic sur #begin-game -> début aventure");
    goToScreen("game");
    startNextMiniGame();
  });
}

// ==========================
// Timer global
// ==========================
export function startTimer(totalSeconds = DEFAULT_TOTAL_TIME) {
  if (timerRunning) return;
  remainingTime = totalSeconds;
  timerRunning = true;
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    remainingTime--;
    updateTimerDisplay();

    if (remainingTime === STRESS_THRESHOLD) {
      dlog("Seuil stress atteint -> switchToStressAmbience()");
      try { switchToStressAmbience(); } catch(e){ dwarn("switchToStressAmbience() failed:", e); }
      const timerEl = document.getElementById("timer");
      if (timerEl) timerEl.classList.add("stress");
    }

    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      endGame(false);
    }
  }, 1000);
}

function updateTimerDisplay() {
  const el = document.getElementById("timer");
  if (!el) return;
  const minutes = Math.floor(Math.max(0, remainingTime) / 60);
  const seconds = Math.max(0, remainingTime) % 60;
  el.textContent = `⏳ ${minutes}:${String(seconds).padStart(2,"0")}`;
}

// ==========================
// Mini-jeux
// ==========================
export function startNextMiniGame() {
  if (!timerRunning) startTimer(DEFAULT_TOTAL_TIME);

  if (currentPuzzleIndex >= puzzles.length) return endGame(true);

  const puzzle = puzzles[currentPuzzleIndex];
  currentPuzzleIndex++;
  dlog(`Lancement puzzle #${currentPuzzleIndex}`);

  goToScreen("game");

  try {
    puzzle.mount({
      meta: { title: `Énigme ${currentPuzzleIndex}` },
      onSolved: ({ score } = {}) => {
        dlog(`Puzzle résolu (+${score||0})`);
        setScore(getScore() + (score||0));
        playActionEffect("bonus");
        setTimeout(startNextMiniGame, 250);
      },
      onFail: ({ penalty } = {}) => {
        dlog(`Puzzle échoué (-${penalty||0})`);
        setScore(Math.max(0, getScore() - (penalty||0)));
        playActionEffect("error");
        setTimeout(startNextMiniGame, 250);
      }
    });
  } catch(e) {
    derr("Erreur mount puzzle:", e);
    setTimeout(startNextMiniGame, 500);
  }
}

// ==========================
// Fin / reset
// ==========================
export function endGame(victory = true) {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; timerRunning = false; }
  stopAllAudio();
  goToScreen(victory ? "victory" : "defeat");
}

export function resetGame() {
  currentPuzzleIndex = 0;
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; timerRunning = false; }
  setScore(0);
  goToScreen("pseudo");
}
