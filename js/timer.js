// timer.js
import { dlog } from "./debug.js";
import { switchToStressAmbience } from "./audio.js";

let timerInterval;

export function startTimer(duration, onEnd) {
  dlog("startTimer lancé", duration);

  let remaining = duration;
  const el = document.getElementById("timer");
  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    remaining--;
    if (el) {
      el.textContent = remaining;
      if (remaining <= 5) {
        el.classList.add("urgent");
        switchToStressAmbience();
      }
    }
    if (remaining <= 0) {
      clearInterval(timerInterval);
      if (onEnd) onEnd();
    }
  }, 1000);
}

export function stopTimer() {
  clearInterval(timerInterval);
  dlog("stopTimer appelé");
}
