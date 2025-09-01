import { initRouter, goToScreen } from "./router.js";

let totalTime = 600; // 10 min
let remainingTime = totalTime;
let timerInterval = null;

document.addEventListener("DOMContentLoaded", () => {
  const pseudoForm = document.getElementById("pseudo-form");

  pseudoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const pseudo = document.getElementById("pseudo-input").value.trim();
    if (!pseudo) return;
    localStorage.setItem("playerName", pseudo);
    document.getElementById("player-name").textContent = pseudo;
    document.getElementById("hud").classList.remove("hidden");
    goToScreen("intro");
    startTimer();
  });

  initRouter();
});

// === Timer dynamique ===
function startTimer() {
  const timerEl = document.getElementById("timer");
  remainingTime = totalTime;
  timerInterval = setInterval(() => {
    remainingTime--;

    let minutes = Math.floor(remainingTime / 60);
    let seconds = remainingTime % 60;
    timerEl.textContent = `${minutes}:${String(seconds).padStart(2, "0")}`;

    // Couleurs et clignotement
    if (remainingTime <= 60) {
      timerEl.classList.add("blink");
      timerEl.classList.add("red");
    } else if (remainingTime <= 300) {
      timerEl.classList.add("red");
    }

    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      timerEl.textContent = "0:00";
      goToScreen("defeat");
    }
  }, 1000);
}
