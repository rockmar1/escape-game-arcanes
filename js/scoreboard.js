// scoreboard.js

// Fonction pour afficher les scores dans l'admin ou l'écran des scores
export function renderScores(scores) {
  const scoreboardEl = document.getElementById("scoreboard");
  if (!scoreboardEl) {
    console.warn("⚠️ Aucun élément #scoreboard trouvé dans le DOM");
    return;
  }

  scoreboardEl.innerHTML = "";

  scores.forEach(player => {
    const li = document.createElement("li");
    li.textContent = `${player.name} : ${player.score}`;
    scoreboardEl.appendChild(li);
  });
}
