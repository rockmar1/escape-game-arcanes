// js/router.js
// Gestion des écrans, file de puzzles, timer, HUD, fins, et pont pour le panneau admin.

import { dlog, dwarn, derr } from "./debug.js";
import { playMusic, stopAllMusic, playSfx, switchToNormalAmbience } from "./audio.js";
import { writeWithQuill } from "./plume.js";
import { getRandomIntro } from "./intro.js";
import { startTimer, stopTimer, addSeconds, halveRemaining, getRemaining } from "./timer.js";
import { setPlayerName, addScore, setScore, resetScore, getScore } from "./state.js";
import { addScoreEntry, renderScoreboardTo, loadScores, clearScores } from "./scoreboard.js";

// Import des puzzles (chaque module doit exporter mount({container,onSolved,onFail,meta}), getAnswer() optionnel)
import * as puzzleClock from "./puzzles/puzzleClock.js";
import * as puzzleCrystals from "./puzzles/puzzleCrystals.js";
import * as puzzleLabyrinth from "./puzzles/puzzleLabyrinth.js";
import * as puzzlePotions from "./puzzles/puzzlePotions.js";
import * as puzzleRunes from "./puzzles/puzzleRunes.js";
import * as puzzleStars from "./puzzles/puzzleStars.js";
import * as puzzleTextInverse from "./puzzles/puzzleTextInverse.js";
import * as puzzleSound from "./puzzles/puzzleSound.js";

const ALL_PUZZLES = [
  { id: "clock", mod: puzzleClock, title: "Horloge" },
  { id: "crystals", mod: puzzleCrystals, title: "Cristaux" },
  { id: "lab", mod: puzzleLabyrinth, title: "Labyrinthe" },
  { id: "potions", mod: puzzlePotions, title: "Potions" },
  { id: "runes", mod: puzzleRunes, title: "Runes" },
  { id: "stars", mod: puzzleStars, title: "Étoiles" },
  { id: "text", mod: puzzleTextInverse, title: "Texte Inversé" },
  { id: "sound", mod: puzzleSound, title: "Énigme Sonore" }
];

// état interne
let queue = [];
let idx = 0;
let puzzleRunning = false;
let currentModule = null;
let currentMeta = null;
let nightmareMode = false;

dlog("router.js chargé");

// Expose fonctions globales utiles pour admin fallback
window.skipCurrentPuzzle = skipCurrentPuzzle;
window.revealCurrentAnswer = revealCurrentAnswer;
window.toggleNightmare = toggleNightmare;
window.endGame = endGame;
window.resetGame = resetGame;
window.getGameDebug = getGameDebug;
window.getCurrentTrack = () => { try { return (typeof window.getCurrentTrack === "function") ? window.getCurrentTrack() : null; } catch (e) { return null; } };

// ---------- helpers UI ----------
function showScreen(name) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const el = document.getElementById(`screen-${name}`);
  if (!el) {
    dwarn("Écran introuvable:", name);
    return;
  }
  el.classList.add("active");
  dlog(`Écran affiché : #screen-${name}`);
}

// ---------- initialisation router ----------
export function initRouter() {
  dlog("initRouter -> affichage écran pseudo");
  loadScores(); // hydrate scoreboard depuis localStorage
  showScreen("pseudo");
  // cacher le HUD jusqu'au début du jeu
  const hud = document.getElementById("hud");
  if (hud) hud.classList.add("hidden");
  // s'assurer que puzzle container est vide
  const pc = document.getElementById("puzzle-container");
  if (pc) pc.innerHTML = "";
}

// ---------- intro ----------
export function goToIntro() {
  showScreen("intro");
  // lancer musique intro (si présente)
  try { stopAllMusic(); playMusic("intro"); } catch (e) { dwarn("playMusic intro failed", e); }

  const introEl = document.getElementById("intro-text");
  if (!introEl) {
    dwarn("intro-text absent");
    return;
  }
  const txt = getRandomIntro();
  // writeWithQuill joue aussi le sfx
  writeWithQuill(introEl, txt, { speed: 28 })
    .then(() => dlog("Intro terminée (effet plume fini)"))
    .catch(e => dwarn("Intro plume failed", e));
}

// ---------- démarrage aventure ----------
export function startAdventure() {
  dlog("startAdventure -> préparation de la file de puzzles");
  // Compose queue aléatoire (6 puzzles max pour une session équilibrée)
  queue = [...ALL_PUZZLES].sort(() => Math.random() - 0.5).slice(0, 6);
  idx = 0;
  puzzleRunning = false;
  currentModule = null;
  currentMeta = null;
  resetScore();

  // Afficher HUD
  const hud = document.getElementById("hud");
  if (hud) hud.classList.remove("hidden");

  // Jouer musique de jeu
  try { stopAllMusic(); switchToNormalAmbience(); } catch (e) { /* ignore */ }

  // Démarrer timer global (10 minutes)
  startTimer(600,
    () => { dlog("Timer fin -> endGame(false)"); endGame(false); },
    (remaining) => { /* tick callback : affichage déjà géré par timer.js */ }
  );

  // Lancer premier puzzle
  setTimeout(() => startNextMiniGame(), 300);
}

// ---------- enchaînement mini-jeux ----------
export function startNextMiniGame() {
  if (puzzleRunning) {
    dlog("startNextMiniGame ignoré — un puzzle est déjà en cours");
    return;
  }
  if (idx >= queue.length) {
    dlog("Tous les puzzles terminés -> victoire");
    return endGame(true);
  }

  const item = queue[idx++];
  const mod = item.mod;
  currentModule = mod;
  currentMeta = item;

  dlog("Mount puzzle:", item.title);

  // clean previous overlay/container to avoid stacking
  const area = document.getElementById("puzzle-container") || document.getElementById("game-area");
  if (area) area.innerHTML = "";

  puzzleRunning = true;

  if (!mod || typeof mod.mount !== "function") {
    dwarn("Module puzzle invalide pour", item);
    puzzleRunning = false;
    setTimeout(() => startNextMiniGame(), 300);
    return;
  }

  try {
    mod.mount({
      container: area,
      meta: { id: item.id, title: item.title },
      onSolved: (data = {}) => {
        const score = typeof data.score === "number" ? data.score : 100;
        const bonus = typeof data.bonus === "number" ? data.bonus : 0;
        dlog(`Puzzle résolu (+${score + bonus}) : ${item.title}`);
        addScore(score + bonus);
        try { playSfx("correct"); } catch (e) { /* ignore */ }
        puzzleRunning = false;
        currentModule = null;
        currentMeta = null;
        // small delay before next puzzle
        setTimeout(() => startNextMiniGame(), 350);
      },
      onFail: (data = {}) => {
        const penalty = typeof data.penalty === "number" ? data.penalty : 20;
        const timePenalty = typeof data.timePenalty === "number" ? data.timePenalty : 10;
        dlog(`Puzzle échoué (-${penalty}) : ${item.title}`);
        addScore(-Math.abs(penalty));
        if (timePenalty) addSeconds(-Math.abs(timePenalty));
        try { playSfx("error"); } catch (e) { /* ignore */ }
        puzzleRunning = false;
        currentModule = null;
        currentMeta = null;
        // next puzzle after small delay
        setTimeout(() => startNextMiniGame(), 350);
      }
    });
  } catch (e) {
    derr("Erreur lors du mount du puzzle:", e);
    puzzleRunning = false;
    currentModule = null;
    currentMeta = null;
    setTimeout(() => startNextMiniGame(), 600);
  }
}

// ---------- admin helpers ----------
export function skipCurrentPuzzle() {
  if (!puzzleRunning) {
    dwarn("skipCurrentPuzzle: aucun puzzle en cours");
    return;
  }
  dlog("skipCurrentPuzzle appelé");
  try { playSfx("portal"); } catch (e) {}
  // essayer d'unmount proprement si le module l'expose
  try {
    if (currentModule && typeof currentModule.unmount === "function") currentModule.unmount();
  } catch (e) { dwarn("unmount error", e); }
  puzzleRunning = false;
  currentModule = null;
  currentMeta = null;
  setTimeout(() => startNextMiniGame(), 250);
}

export function revealCurrentAnswer() {
  const lastIdx = Math.max(0, idx - 1);
  const last = queue[lastIdx];
  if (!last || !last.mod || typeof last.mod.getAnswer !== "function") {
    dwarn("revealCurrentAnswer: réponse non disponible");
    alert("Aucune réponse disponible pour ce puzzle.");
    return;
  }
  const ans = last.mod.getAnswer();
  dlog("Réponse révélée (admin):", ans);
  alert("Réponse : " + ans);
}

export function toggleNightmare() {
  nightmareMode = !nightmareMode;
  if (nightmareMode) {
    halveRemaining();
    dlog("Mode Cauchemar activé : temps réduit");
    alert("Mode Cauchemar activé (temps réduit) !");
  } else {
    dlog("Mode Cauchemar désactivé");
    alert("Mode Cauchemar désactivé");
  }
}

// ---------- fin et reset ----------
export function endGame(victory = true) {
  dlog("endGame appelé — victory:", victory);
  // stop timer & musiques
  try { stopTimer(); } catch (e) { /* ignore */ }
  try { stopAllMusic(); } catch (e) { /* ignore */ }

  // prepare entry
  const pseudoEl = document.getElementById("hud-player");
  const pseudo = pseudoEl ? String(pseudoEl.textContent).replace("👤 ", "") : (getPlayerName ? getPlayerName() : "Anonyme");
  const entry = {
    pseudo,
    result: victory ? "victory" : "defeat",
    score: getScore ? getScore() : 0,
    time: document.getElementById("timer") ? document.getElementById("timer").textContent : "",
    date: new Date().toLocaleString()
  };

  if (victory) {
    try { playMusic("victory", { loop: false, volume: 0.85 }); } catch (e) {}
    const text = ["Le Royaume renaît sous une aube dorée.", "La lumière triomphe grâce à toi.", "Les bardes chanteront tes exploits."][Math.floor(Math.random() * 3)];
    const vEl = document.getElementById("victory-text"); if (vEl) vEl.textContent = text;
    showScreen("victory");
  } else {
    try { playMusic("defeat", { loop: false, volume: 0.85 }); } catch (e) {}
    const text = ["Les ténèbres engloutissent le royaume...", "La flamme s'éteint.", "La nuit triomphe."][Math.floor(Math.random() * 3)];
    const dEl = document.getElementById("defeat-text"); if (dEl) dEl.textContent = text;
    showScreen("defeat");
  }

  // save scoreboard entry
  try { addScoreEntry(entry); renderScoreboardTo("scoreboard-list"); } catch (e) { dwarn("score save failed", e); }

  // after short delay show scoreboard screen (uses id 'screen-scoreboard')
  setTimeout(() => {
    try { renderScoreboardTo("scoreboard-list"); showScreen("scoreboard"); } catch (e) { /* fallback: show scoreboard section directly */ const el = document.getElementById("screen-scoreboard"); if (el) { document.querySelectorAll(".screen").forEach(s => s.classList.remove("active")); el.classList.add("active"); } }
  }, 1800);

  // cleanup puzzle area
  const area = document.getElementById("puzzle-container");
  if (area) area.innerHTML = "";
  puzzleRunning = false;
  currentModule = null;
  currentMeta = null;
}

// ---------- reset complet ----------
export function resetGame() {
  dlog("resetGame appelé");
  try { stopTimer(); } catch (e) {}
  try { stopAllMusic(); } catch (e) {}
  resetScore();
  // clear puzzle area
  const pc = document.getElementById("puzzle-container"); if (pc) pc.innerHTML = "";
  // show pseudo
  showScreen("pseudo");
}

// ---------- debug helper ----------
export function getGameDebug() {
  return {
    queueLength: queue.length,
    currentIndex: idx,
    puzzleRunning,
    nightmareMode,
    score: getScore ? getScore() : 0,
    remaining: getRemaining ? getRemaining() : null,
    currentPuzzle: currentMeta ? currentMeta.id : null
  };
}