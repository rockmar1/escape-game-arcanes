// router.js (instrumenté)
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

// --- Import des puzzles (attends qu'ils existent dans ./puzzles/) ---
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

// Par défaut le temps total du jeu (secondes). Si tu veux 10min -> 600
const DEFAULT_TOTAL_TIME = 300; // 300s = 5 min
const STRESS_THRESHOLD = 300;   // basculer en ambiance_stress quand il reste <= 300s (5min)

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
    // Arrêter ambiances
    try { stopAllAudio(); } catch (e) { derr("stopAllAudio() a échoué:", e); }
    // jouer jingle victoire/défaite si présent
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
// Timer (global pour toute la partie)
// -----------------------------
export function startTimer(totalSeconds = DEFAULT_TOTAL_TIME) {
  // Ne relancer le timer que s'il n'est pas déjà lancé
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

    // bascule en stress si on est passé sous le seuil et que le jeu était plus long que le seuil
    if (totalSeconds > STRESS_THRESHOLD && remaining <= STRESS_THRESHOLD) {
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
  // Démarre le timer la première fois que l'on entre dans un mini-jeu
  if (!timerRunning) {
    dlog("Premier mini-jeu : démarrage du timer global");
    startTimer(DEFAULT_TOTAL_TIME);
    // démarrage de l'ambiance normale (si besoin)
    try { initAudioOnUserGesture(); } catch (e) { dlog("initAudioOnUserGesture() failed:", e); }
  }

  if (currentPuzzleIndex >= puzzles.length) {
    dlog("Tous les puzzles terminés -> victoire");
    return endGame(true);
  }

  const puzzleModule = puzzles[currentPuzzleIndex];
  currentPuzzleIndex++;
  dlog(`Lancement puzzle #${currentPuzzleIndex}`);

  // Affiche l'écran de jeu
  goToScreen("game");

  // Met à jour HUD joueur si possible
  const hud = document.getElementById("hud-player");
  if (hud) hud.textContent = `👤 ${getPlayerName()}`;

  // Monte le puzzle
  if (!puzzleModule || typeof puzzleModule.mount !== "function") {
    derr(`Module puzzle invalide à l'index ${currentPuzzleIndex - 1}`);
    // passe au suivant pour ne pas bloquer
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
        // délai court avant de passer au suivant pour laisser l'overlay de succès se terminer
        setTimeout(() => startNextMiniGame(), 250);
      },
      onFail: ({ penalty } = {}) => {
        dlog(`Puzzle échoué (-${penalty || 0})`);
        setScore(Math.max(0, getScore() - (penalty || 0)));
        try { playActionEffect("error"); } catch (e) { /* ignore */ }
        // on laisse le puzzle décider s'il faut retenter ; par défaut on enchaîne
        setTimeout(() => startNextMiniGame(), 250);
      }
    });
  } catch (e) {
    derr("Erreur lors du mount du puzzle:", e);
    // éviter de bloquer la progression
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
  // Arrêter les ambiances
  try { stopAllAudio(); } catch (e) { dlog("stopAllAudio error:", e); }

  // Afficher écran final
  goToScreen(victory ? "victory" : "defeat");

  // jouer jingle de fin si dispo
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
