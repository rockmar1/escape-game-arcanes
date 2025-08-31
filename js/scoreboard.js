// scoreboard.js
let scores = [];

export function saveScore(player, score) {
  scores.push({ player, score, date: new Date().toISOString() });
  localStorage.setItem("scoreboard", JSON.stringify(scores));
}

export function loadScores() {
  const data = localStorage.getItem("scoreboard");
  if (data) scores = JSON.parse(data);
  return scores;
}

export function resetScoreboard() {
  scores = [];
  localStorage.removeItem("scoreboard");
}
