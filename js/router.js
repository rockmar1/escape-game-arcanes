import { dlog, dwarn, derr } from "./debug.js";
import { getPlayerName, setScore, getScore } from "./state.js";
import {
  initAudioOnUserGesture,
  playActionEffect,
  stopAllAudio,
  switchToStressAmbience,
  switchToNormalAmbience,
  playAudioForScreen
} from "./audio.js";

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
let remaining = 0;
let timerRunning = false;

const DEFAULT_TOTAL_TIME = 600; // 10 min
const STRESS_THRESHOLD = 300;   // 5 min

dlog("router.js chargé");

// -----------------------------
// Gestion écrans
// -----------------------------
export function goToScreen(screenName) {
  const id = "screen-" + screenName;
  dlog(`goToScreen("${screenName}") demandé -> #${id}`);

  const allScreens = document.querySelectorAll(".screen");
  if (!allScreens || allScreens.length === 0) {
    derr("Aucun élément .screen trouvé !");
    return;
  }

  const target = document.getElementById(id);
  if (!target) {
    derr(`Écran introuvable : #${id}`);
    return;
  }

  // Masquer tous les écrans
  allScreens.forEach(s => {
    s.classList.remove("active");
    s.classList.add("hidden");
  });

  // Afficher l'écran cible
  target.classList.remove("hidden");
  target.classList.add("active");
  dlog(`Écran affiché : #${id}`);

  // Lancer musique selon écran
  if (screenName === "victory" || screenName === "defeat") {
    dlog("Arrêt des musiques + jingle final");
    try { stopAllAudio(); } catch(e){ dwarn("stopAllAudio() failed:", e); }
    const jingle = screenName === "victory" ? "victoire" : "defaite";
    try { playAudioForScreen(jingle); } catch(e){ dwarn("playAudioForScreen() failed:", e); }
  } else {
    try { playAudioForScreen(screenName); } catch(e){ dwarn("playAudioForScreen() failed:", e); }
  }
}

// -----------------------------
// Initialisation router
// -----------------------------
export function initRouter() {
  dlog("initRouter() -> affichage écran pseudo");
  goToScreen("pseudo");
}

// -----------------------------
// Timer global
// -----------------------------
export function startTimer(totalSeconds = DEFAULT_TOTAL_TIME) {
  if (timerRunning) { dlog("Timer déjà en cours"); return; }

  remaining = totalSeconds;
  timerRunning = true;
  updateTimerDisplay();
  dlog(`Timer démarré : ${totalSeconds}s`);

  timerInterval = setInterval(() => {
    remaining--;
    updateTimerDisplay();

    if (remaining === STRESS_THRESHOLD) {
      dlog("Seuil stress atteint -> switchToStressAmbience()");
      try { switchToStressAmbience(); } catch(e){ dwarn("switchToStressAmbience() failed:", e); }
      const timerEl = document.getElementById("timer");
      if (timerEl) timerEl.classList.add("stress");
    }

    if (remaining <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      dlog("Temps écoulé -> fin partie");
      endGame(false);
    }
  }, 1000);
}

function updateTimerDisplay() {
  const el = document.getElementById("timer");
  if (!el) { dwarn("Aucun #timer trouvé"); return; }
  const min = Math.floor(Math.max(0, remaining)/60);
  const sec = Math.max(0, remaining)%60;
  el.textContent = `⏳ ${min}:${String(sec).padStart(2,"0")}`;
}

// -----------------------------
// Mini-jeux
// -----------------------------
export function startNextMiniGame() {
  if (!timerRunning) {
    dlog("Premier mini-jeu : démarrage timer");
    startTimer(DEFAULT_TOTAL_TIME);
    try { initAudioOnUserGesture(); } catch(e){ dwarn("initAudioOnUserGesture() failed:", e); }
  }

  if (currentPuzzleIndex >= puzzles.length) {
    dlog("Tous les puzzles terminés -> victoire");
    return endGame(true);
  }

  const puzzle = puzzles[currentPuzzleIndex];
  currentPuzzleIndex++;
  dlog(`Lancement puzzle #${currentPuzzleIndex}`);

  goToScreen("game");
  const hud = document.getElementById("hud-player");
  if (hud) hud.textContent = `👤 ${getPlayerName()}`;

  if (!puzzle || typeof puzzle.mount !== "function") {
    derr(`Puzzle invalide à l'index ${currentPuzzleIndex-1}`);
    setTimeout(() => startNextMiniGame(), 300);
    return;
  }

  try {
    puzzle.mount({
      meta: { title: `Énigme ${currentPuzzleIndex}` },
      onSolved: ({ score } = {}) => {
        dlog(`Puzzle résolu (+${score||0})`);
        setScore(getScore() + (score||0));
        try { playActionEffect("bonus"); } catch(e){}
        setTimeout(() => startNextMiniGame(), 250);
      },
      onFail: ({ penalty } = {}) => {
        dlog(`Puzzle échoué (-${penalty||0})`);
        setScore(Math.max(0,getScore() - (penalty||0)));
        try { playActionEffect("error"); } catch(e){}
        setTimeout(() => startNextMiniGame(), 250);
      }
    });
  } catch(e){
    derr("Erreur mount puzzle:", e);
    setTimeout(()=>startNextMiniGame(),500);
  }
}

// -----------------------------
// Fin / reset
// -----------------------------
export function endGame(victory=true) {
  dlog(`endGame(${victory}) appelé`);
  if (timerInterval) { clearInterval(timerInterval); timerInterval=null; timerRunning=false; }
  try { stopAllAudio(); } catch(e){}
  goToScreen(victory ? "victory" : "defeat");
  const jingle = victory ? "victoire" : "defaite";
  try { playAudioForScreen(jingle); } catch(e){}
}

export function resetGame() {
  dlog("resetGame() appelé");
  currentPuzzleIndex=0;
  if (timerInterval) { clearInterval(timerInterval); timerInterval=null; timerRunning=false; }
  setScore(0);
  try { switchToNormalAmbience(); } catch(e){}
  goToScreen("pseudo");
}
