import { dlog } from "./debug.js";
import { endGame } from "./router.js";
import { switchToStressAmbience } from "./audio.js";

let timerInterval = null;
let remainingTime = 0;

/**
 * Démarre le timer global
 * @param {number} duration - en secondes (ex: 600 = 10 min)
 */
export function startTimer(duration = 600) {
  remainingTime = duration;
  updateTimerDisplay();

  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    remainingTime--;
    updateTimerDisplay();

    // Passage en mode stress (<= 5 min)
    if (remainingTime === 300) {
      switchToStressAmbience();
      dlog("⏰ Passage en musique stress (moins de 5 min)");
    }

    // Fin du timer
    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      endGame(false); // défaite
      dlog("💀 Timer écoulé -> défaite");
    }
  }, 1000);

  dlog(`⏳ Timer démarré (${duration}s)`);
}

/**
 * Met à jour l’affichage du timer
 */
function updateTimerDisplay() {
  const hudTimer = document.getElementById("hud-timer");
  if (!hudTimer) return;

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  hudTimer.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  // Effets visuels
  if (remainingTime <= 60) {
    hudTimer.classList.add("timer-critical");
    hudTimer.classList.remove("timer-warning");
  } else if (remainingTime <= 300) {
    hudTimer.classList.add("timer-warning");
    hudTimer.classList.remove("timer-critical");
  } else {
    hudTimer.classList.remove("timer-warning", "timer-critical");
  }
}

/**
 * Arrête le timer
 */
export function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    dlog("⏹️ Timer arrêté");
  }
  remainingTime = 0;
  updateTimerDisplay();
}

/**
 * Remet à zéro le timer
 */
export function resetTimer() {
  stopTimer();
  remainingTime = 0;
  updateTimerDisplay();
  dlog("🔄 Timer réinitialisé");
}
