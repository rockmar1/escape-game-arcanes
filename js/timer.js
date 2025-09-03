// === timer.js ===
import { endGame } from "./router.js";

let timeLeft = 0;
let timerInterval = null;

export function startTimer(seconds) {
  timeLeft = seconds;
  console.log("[DBG] Timer démarré", timeLeft, "s");

  updateTimerDisplay();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame(false); // défaite
    }
  }, 1000);
}

export function resetTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timeLeft = 0;
  document.getElementById("timer").textContent = "00:00";
}

function updateTimerDisplay() {
  const timerEl = document.getElementById("timer");
  if (!timerEl) return;

  const min = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const sec = String(timeLeft % 60).padStart(2, "0");
  timerEl.textContent = `${min}:${sec}`;

  // mise en forme visuelle
  if (timeLeft <= 60) {
    timerEl.classList.add("critical");
    timerEl.classList.remove("warning");
  } else if (timeLeft <= 300) {
    timerEl.classList.add("warning");
    timerEl.classList.remove("critical");
  } else {
    timerEl.classList.remove("warning", "critical");
  }
}
