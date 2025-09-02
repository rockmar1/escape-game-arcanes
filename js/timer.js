import { logDebug } from "./debug.js";
import { goToScreen } from "./router.js";
import { stopAllMusic, playMusic } from "./audio.js";

let timerInterval;
let timeLeft = 600;

export function startTimer(duration = 600) {
  clearInterval(timerInterval);
  timeLeft = duration;
  updateTimerDisplay();
  logDebug("⏳ Timer démarré (" + duration + "s)");

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      logDebug("⏰ Temps écoulé -> défaite");
      stopAllMusic();
      playMusic("defeat");
      goToScreen("defeat");
    }
  }, 1000);
}

export function resetTimer() {
  clearInterval(timerInterval);
  document.getElementById("timer").textContent = "";
}

function updateTimerDisplay() {
  const el = document.getElementById("timer");
  if (!el) return;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  el.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  el.classList.remove("warning", "blink");

  if (timeLeft <= 300 && timeLeft > 60) {
    el.classList.add("warning");
  } else if (timeLeft <= 60) {
    el.classList.add("blink");
  }
}
