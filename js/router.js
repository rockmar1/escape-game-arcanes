// router.js
import { showScreen } from "./ui.js";
import { resetGame, setPlayerName, gameState } from "./state.js";
import { autoSaveResult, loadScoreboard } from "./scoreboard.js";
import { initPuzzles } from "./puzzles/index.js";
import { initAudioOnUserGesture, stopAllAudio } from "./audio.js";

let timerInterval = null;

/** Start the game (can be called by UI or admin) */
export function startGame(name) {
  if (name) setPlayerName(name);
  if (!gameState.player) {
    console.warn("[router] startGame called but player name is missing");
    return;
  }

  resetGame();
  initAudioOnUserGesture();     // start audio after user gesture
  initPuzzles();               // populate puzzles (random order)
  updateHUD();
  showScreen("screen-game");

  // clear any existing timer
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    gameState.timeLeft = Math.max(0, (gameState.timeLeft ?? 300) - 1);
    const tEl = document.getElementById("timer");
    if (tEl) tEl.textContent = `${gameState.timeLeft}s`;

    if (gameState.timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame(false, "Le temps est écoulé.");
    }
  }, 1000);
}

/** End game: saves result and shows screen */
export function endGame(victory = false, message = "") {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  stopAllAudio();

  // Save score
  autoSaveResult(!!victory);

  // show end screen
  if (victory) {
    const el = document.getElementById("end-title");
    if (el) el.textContent = "Victoire ✨";
    const msg = document.getElementById("end-message");
    if (msg) msg.textContent = message || "Bravo, vous avez sauvé le royaume !";
  } else {
    const el = document.getElementById("end-title");
    if (el) el.textContent = "Défaite ☠️";
    const msg = document.getElementById("end-message");
    if (msg) msg.textContent = message || "Le royaume sombre dans l'oubli...";
  }

  showScreen("screen-end");
}

/** Return to menu */
export function backToMenu() {
  showScreen("screen-start");
}

/** Give +seconds to the timer (admin) */
export function addTime(seconds = 60) {
  gameState.timeLeft = (gameState.timeLeft ?? 300) + Number(seconds);
  const tEl = document.getElementById("timer");
  if (tEl) tEl.textContent = `${gameState.timeLeft}s`;
  console.debug("[router] addTime:", seconds, "newTime:", gameState.timeLeft);
}

/**
 * Request current puzzle to unmount (loader/puzzle modules should set window.currentPuzzleUnmount)
 * admin can call this to skip a stuck puzzle
 */
export function skipCurrentPuzzle() {
  if (window.currentPuzzleUnmount && typeof window.currentPuzzleUnmount === "function") {
    try {
      window.currentPuzzleUnmount();
      console.debug("[router] current puzzle unmounted via skip");
      showScreen("screen-game");
    } catch (e) {
      console.error("[router] skipCurrentPuzzle failed:", e);
      alert("Impossible de sauter l'énigme (erreur interne).");
    }
  } else {
    alert("Aucune énigme en cours à sauter.");
  }
}

/** Small helper to update HUD score/time display */
function updateHUD() {
  const nameEl = document.getElementById("hud-player");
  const scoreEl = document.getElementById("hud-score");
  const timeEl = document.getElementById("timer");
  if (nameEl) nameEl.textContent = gameState.player || "";
  if (scoreEl) scoreEl.textContent = String(gameState.score ?? 0);
  if (timeEl) timeEl.textContent = `${gameState.timeLeft ?? 300}s`;
}

/** Attach start button and menu buttons on DOM load */
document.addEventListener("DOMContentLoaded", () => {
  // start button
  const btn = document.getElementById("btn-start") || document.getElementById("start-btn") || document.querySelector("[data-start]");
  if (btn) {
    btn.addEventListener("click", () => {
      // prefer explicit playerName input id 'playerName' (some html versions)
      const nameInput = document.getElementById("playerName") || document.getElementById("player-name") || document.getElementById("playerNameInput");
      const name = nameInput ? nameInput.value.trim() : "";
      if (!name) { alert("Entrez un pseudo pour commencer !"); return; }
      setPlayerName(name);
      startGame();
    });
  } else {
    console.warn("[router] start button not found in DOM");
  }

  // replay / menu buttons (if present)
  document.getElementById("btn-replay")?.addEventListener("click", () => {
    location.reload();
  });
  document.getElementById("btn-menu1")?.addEventListener("click", backToMenu);
  document.getElementById("btn-menu2")?.addEventListener("click", backToMenu);

  // render scoreboard if present
  loadScoreboard();
});
