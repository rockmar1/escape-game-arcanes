// puzzleLabyrinth.js
import { dlog, dwarn } from "../debug.js";

export function mount({ meta, onSolved, onFail }) {
  const container = document.getElementById("puzzle-container");
  if (!container) { dwarn("Aucun container pour puzzleLabyrinth"); return; }
  container.innerHTML = "";
  dlog(`Mount puzzle: ${meta.title}`);

  const puzzleEl = document.createElement("div");
  puzzleEl.className = "puzzle";
  puzzleEl.innerHTML = `
    <p>🌀 Trouvez la sortie du labyrinthe !</p>
    <button id="solve-labyrinth">Résoudre</button>
    <button id="fail-labyrinth">Échouer</button>
  `;
  container.appendChild(puzzleEl);

  document.getElementById("solve-labyrinth").addEventListener("click", () => {
    container.innerHTML = "";
    dlog(`Puzzle résolu: ${meta.title}`);
    if (onSolved) onSolved({ score: 70 });
  });

  document.getElementById("fail-labyrinth").addEventListener("click", () => {
    container.innerHTML = "";
    dlog(`Puzzle échoué: ${meta.title}`);
    if (onFail) onFail({ penalty: 35 });
  });
}
