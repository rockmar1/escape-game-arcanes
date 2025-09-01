// router.js (instrumenté).
// Gère navigation écran, timer, enchaînement mini-jeux, et coupe/commute l'audio.
// Utilise debug.js pour logs visibles dans #debug-log + console.

import { dlog, dwarn, derr } from "./debug.js";
import { getPlayerName, setScore, getScore } from "./state.js";
import {
  initAudioOnUserGesture,
  playActionEffect,
  stopAllAudio,
  switchToStressAmbience,
  switchToNormalAmbience
} from "./audio.js";

// --- Import des puzzles (assure-toi qu'ils existent dans ./puzzles/) ---
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

// === État ===
let currentPuzzleIndex = 0;
let timerInterval = null;
let remaining = 0;
let timerRunning = false;

// Par défaut le temps total du jeu (secondes). Exemple : 600 = 10min
const DEFAULT_TOTAL_TIME = 600; // tu peux modifier selon ton besoin
const STRESS_THRESHOLD = 300;   // 5 minutes restantes

dlog("router.js chargé");

// -----------------------------
// Navigation d'écrans
// -----------------------------
export function goToScreen(screenName) {
  const id = "screen-" + screenName;
  dlog(`goToScreen("${screenName}") demandé -> #${id}`);

  const all = document.querySelectorAll(".screen");
  if (!all || all.length === 0) {
    derr("Aucun élément .screen trouvé dans le DOM !");
    return;
  }

  const screenEl = document.getElementById(id);
  if (!screenEl) {
    derr(`Écran introuvable : #${id}`);
    return;
  }

  // cacher tous, afficher celui demandé
  all.forEach(s => s.classList.add("hidden"));
  screenEl.classList.remove("hidden");
  dlog(`Écran affiché : #${id}`);

  // Gestion audio à l'arrivée sur des écrans spéciaux
  if (screenName === "victory" || screenName === "defeat") {
    dlog("Arrêt des musiques (victoire/défaite) et jingle final");
    try { stopAllAudio(); } catch (e) { derr("stopAllAudio() a échoué:", e); }
    const jingleSrc = screenName === "victory" ? "assets/audio/victoire.mp3" : "assets/audio/defaite.mp3";
    try { new Audio(jingleSrc).play().catch(()=>{}); } catch (e) { /* ignore */ }
  }
}

// -----------------------------
// Initialisation du router
// -----------------------------
export function initRouter() {
  dlog("initRouter() -> affichage écran pseudo par défaut");
  goToScreen("pseudo");
}

// -----------------------------
// Timer
// -----------------------------
export function startTimer(totalSeconds = DEFAULT_TOTAL_TIME) {
  if (timerRunning) {
    dlog("startTimer() ignoré : timer déjà en cours");
    return;
  }

  remaining = totalSeconds;
  timerRunning = true;
  updateTimerDisplay();

  dlog(`Timer démarré (${totalSeconds}s). Seuil stress = ${STRESS_THRESHOLD}s`);

  timerInterval = setInterval(() => {
    remaining--;
    updateTimerDisplay();

    if (totalSeconds > STRESS_THRESHOLD && remaining === STRESS_THRESHOLD) {
      dlog("Seuil stress atteint -> switchToStressAmbience()");
      try { switchToStressAmbience(); } catch (e) { derr("switchToStressAmbience() failed:", e); }
      const timerEl = document.getElementById("timer");
      if (timerEl) timerEl.classList.add("stress");
    }

    if (remaining <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      dlog("Temps écoulé -> fin de la partie (défaite)");
      endGame(false);
    }
  }, 1000);
}

function updateTimerDisplay() {
  const el = document.getElementById("timer");
  if (!el) {
    dwarn("Aucun élément #timer trouvé pour afficher le temps.");
    return;
  }
  const minutes = Math.floor(Math.max(0, remaining) / 60);
  const seconds = Math.max(0, remaining) % 60;
  el.textContent = `⏳ ${minutes}:${String(seconds).padStart(2, "0")}`;
}

// -----------------------------
// Mini-jeux / progression
// -----------------------------
export function startNextMiniGame() {
  if (!timerRunning) {
    dlog("Premier mini-jeu : démarrage du timer global");
    startTimer(DEFAULT_TOTAL_TIME);
    try { initAudioOnUserGesture(); } catch (e) { dlog("initAudioOnUserGesture() failed:", e); }
  }

  if (currentPuzzleIndex >= puzzles.length) {
    dlog("Tous les puzzles terminés -> victoire");
    return endGame(true);
  }

  const puzzleModule = puzzles[currentPuzzleIndex];
  currentPuzzleIndex++;
  dlog(`Lancement puzzle #${currentPuzzleIndex}`);

  goToScreen("game");

  const hud = document.getElementById("hud-player");
  if (hud) hud.textContent = `👤 ${getPlayerName()}`;

  if (!puzzleModule || typeof puzzleModule.mount !== "function") {
    derr(`Module puzzle invalide à l'index ${currentPuzzleIndex - 1}`);
    setTimeout(() => startNextMiniGame(), 300);
    return;
  }

  try {
    puzzleModule.mount({
      meta: { title: `Énigme ${currentPuzzleIndex}` },
      onSolved: ({ score } = {}) => {
        dlog(`Puzzle résolu (+${score || 0})`);
        setScore(getScore() + (score || 0));
        try { playActionEffect("bonus"); } catch (e) { /* ignore */ }
        setTimeout(() => startNextMiniGame(), 250);
      },
      onFail: ({ penalty } = {}) => {
        dlog(`Puzzle échoué (-${penalty || 0})`);
        setScore(Math.max(0, getScore() - (penalty || 0)));
        try { playActionEffect("error"); } catch (e) { /* ignore */ }
        setTimeout(() => startNextMiniGame(), 250);
      }
    });
  } catch (e) {
    derr("Erreur lors du mount du puzzle:", e);
    setTimeout(() => startNextMiniGame(), 500);
  }
}

// -----------------------------
// Fin / reset
// -----------------------------
export function endGame(victory = true) {
  dlog(`endGame(${victory}) appelé`);
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    timerRunning = false;
  }
  try { stopAllAudio(); } catch (e) { dlog("stopAllAudio error:", e); }
  goToScreen(victory ? "victory" : "defeat");
  const jingle = victory ? "assets/audio/victoire.mp3" : "assets/audio/defaite.mp3";
  try { new Audio(jingle).play().catch(()=>{}); } catch(e){}
}

export function resetGame() {
  dlog("resetGame() appelé");
  currentPuzzleIndex = 0;
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; timerRunning = false; }
  setScore(0);
  try { switchToNormalAmbience(); } catch (e) { /* ignore */ }
  goToScreen("pseudo");
}
