import { GameState, unlockZone, triggerVictory, triggerDefeat } from "./state.js";
import { showScreen } from "./router.js";
import "./puzzles.js";
import "./admin.js";

document.getElementById("start-btn").addEventListener("click", () => {
  const name = document.getElementById("player-name").value.trim();
  if (!name) return alert("Entre ton pseudo !");
  GameState.player.name = name;
  document.getElementById("player-display").textContent = `Joueur : ${name}`;
  document.getElementById("intro-story").textContent =
    `Bienvenue ${name}, les portes du Royaume s’ouvrent devant toi...`;
  showScreen("screen-intro");
});

document.getElementById("begin-game").addEventListener("click", () => {
  startTimer();
  unlockZone("zone-bibliotheque");
  showScreen("screen-game");
});

function startTimer() {
  const timerEl = document.getElementById("timer-display");
  const interval = setInterval(() => {
    if (GameState.victory || GameState.defeat) return clearInterval(interval);
    GameState.timer--;
    timerEl.textContent = GameState.timer;
    if (GameState.timer <= 0) { triggerDefeat("Le temps est écoulé."); clearInterval(interval); }
  }, 1000);
}
