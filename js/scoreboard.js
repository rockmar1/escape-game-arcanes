import { getPlayerName, getScore } from "./state.js";

const STORAGE_KEY = "escape_scores";

// === Charger scores ===
export function loadScores() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// === Sauvegarder score ===
export function saveScore() {
  const scores = loadScores();
  scores.push({
    player: getPlayerName(),
    score: getScore(),
    date: new Date().toLocaleString()
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
}

// === Reset scores ===
export function resetScores() {
  localStorage.removeItem(STORAGE_KEY);
}

// === Afficher scores ===
export function renderScores(containerId = "game-area") {
  const scores = loadScores().sort((a, b) => b.score - a.score);
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = `
    <h3>🏆 Tableau des Scores</h3>
    <ul>
      ${scores.map(s => `<li>${s.player} — ${s.score} pts (${s.date})</li>`).join("")}
    </ul>
  `;
}
