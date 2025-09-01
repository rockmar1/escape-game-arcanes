import { playAudioForScreen, stopAllAudio, switchToStressAmbience } from "./audio.js";
// ...

let timerInterval = null;
let timeLeft = 600; // 10 minutes par défaut

function startTimer(duration) {
  clearInterval(timerInterval);
  timeLeft = duration;

  const hudTimer = document.getElementById("hud-timer");
  hudTimer.textContent = formatTime(timeLeft);

  timerInterval = setInterval(() => {
    timeLeft--;

    // Mise à jour visuelle
    hudTimer.textContent = formatTime(timeLeft);

    if (timeLeft <= 60) {
      hudTimer.classList.add("blink");
    } else if (timeLeft <= 300) {
      hudTimer.classList.add("red");
      // Passer en musique stressante dès 5 min
      switchToStressAmbience();
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame(false); // défaite
    }
  }, 1000);
}
