import { debugLog } from "./debug.js";
import { switchToStressAmbience } from "./audio.js";

let timerInterval;
let timeLeft = 600; // 10 min

export function startTimer(duration, onDefeat) {
  clearInterval(timerInterval);
  timeLeft = duration;
  updateDisplay();

  debugLog("Timer démarré (" + duration + "s)");

  timerInterval = setInterval(() => {
    timeLeft--;

    // Timer dynamique
    if (timeLeft === 300) {
      debugLog("⚠️ Changement d'ambiance : 5 min restantes !");
      switchToStressAmbience();
      document.getElementById("timer").classList.add("timer-warning");
    }

    if (timeLeft === 60) {
      debugLog("⏳ Dernière minute !");
      document.getElementById("timer").classList.add("timer-flash");
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      debugLog("💀 Temps écoulé -> Défaite !");
      onDefeat();
    }

    updateDisplay();
  }, 1000);
}

export function updateDisplay() {
  const timerElement = document.getElementById("timer");
  if (timerElement) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }
}
