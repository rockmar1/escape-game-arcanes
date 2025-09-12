import { log } from "./debug.js";

export function saveScores(playerName, victory) {
  const scoreboardEl = document.getElementById("scoreboard");
  if (!scoreboardEl) return;

  const scoreItem = document.createElement("li");
  scoreItem.textContent = `${playerName} — ${victory ? "Victoire" : "Défaite"}`;
  scoreboardEl.appendChild(scoreItem);

  // Stockage local si besoin
  let scores = JSON.parse(localStorage.getItem("scores") || "[]");
  scores.push({ player: playerName, victory, date: new Date().toISOString() });
  localStorage.setItem("scores", JSON.stringify(scores));

  log("saveScores");
}

export function loadScores() {
  let scores = JSON.parse(localStorage.getItem("scores") || "[]");
  const scoreboardEl = document.getElementById("scoreboard");
  if (!scoreboardEl) return;

  scoreboardEl.innerHTML = "";
  scores.forEach(s => {
    const li = document.createElement("li");
    li.textContent = `${s.player} — ${s.victory ? "Victoire" : "Défaite"} (${new Date(s.date).toLocaleString()})`;
    scoreboardEl.appendChild(li);
  });

  log("loadScores " + scores.length);
}

// ✅ Réinitialisation des scores
export function resetScores() {
  const scoreboardEl = document.getElementById("scoreboard");
  if (scoreboardEl) {
    scoreboardEl.innerHTML = "";
  }
  localStorage.removeItem("scores");
  log("resetScores");
}
