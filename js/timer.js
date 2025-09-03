import { dlog } from './debug.js';
let timerInterval;

export function startTimer(totalSeconds=600) {
  const hudTimer = document.getElementById('hud-timer');
  clearInterval(timerInterval);
  let secondsLeft = totalSeconds;

  timerInterval = setInterval(() => {
    secondsLeft--;
    const min = Math.floor(secondsLeft/60);
    const sec = secondsLeft%60;
    hudTimer.textContent = `⏳ ${min}:${sec<10?'0':''}${sec}`;
    hudTimer.classList.remove('timer-warning','timer-critical');

    if (secondsLeft <= 60) hudTimer.classList.add('timer-critical');
    else if (secondsLeft <= 300) hudTimer.classList.add('timer-warning');

    if (secondsLeft <= 0) clearInterval(timerInterval);
  }, 1000);
  dlog('Timer démarré', totalSeconds);
}
