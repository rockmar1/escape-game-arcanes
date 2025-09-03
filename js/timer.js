// timer.js
import { dlog } from "./debug.js";

let timerInterval = null;
let remaining = 0;

export function startTimer(totalSeconds) {
  remaining = totalSeconds;
  timerInterval = setInterval(() => {
    remaining--;
    updateTimerDisplay(remaining);
    if (remaining <= 0) clearInterval(timerInterval);
  }, 1000);
  dlog(`Timer démarré (${totalSeconds}s)`);
}

export function stopTimer() {
  clearInterval(timerInterval);
  dlog("Timer stoppé");
}

export function updateTimerDisplay(seconds) {
  const el = document.getElementById("timer");
  if (!el) return;
  const min = Math.floor(seconds/60);
  const sec = seconds%60;
  el.textContent = `⏳ ${min}:${sec.toString().padStart(2,'0')}`;

  if (seconds <= 60) el.style.color = (seconds%2===0) ? "red" : "white"; // clignotant dernière minute
  else if (seconds <= 300) el.style.color = "orange"; // dernière 5 min
  else el.style.color = "white";
}
