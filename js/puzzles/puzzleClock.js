// puzzleClock.js
import { dlog, dwarn } from "../debug.js";

export function mount({ meta, onSolved, onFail }) {
  const container = document.getElementById("puzzle-container");
  if (!container) { dwarn("Aucun container pour puzzleClock"); return; }
  container.innerHTML = "";
  dlog(`Mount puzzle: ${meta.title}`);

  const puzzleEl = document.createElement("div");
  puzzleEl.className = "puzzle";
  puzzleEl.innerHTML = `
    <p>🕰️ Résolvez l'énigme de l'horloge !</p>
    <button id="solve-clock">Résoudre</button>
    <button id="fail-clock">Échouer</button>
  `;
  container.appendChild(puzzleEl);

  document.getElementById("solve-clock").addEventListener("click", () => {
    container.innerHTML = "";
    dlog(`Puzzle résolu: ${meta.title}`);
    if (onSolved) onSolved({ score: 90 });
  });

  document.getElementById("fail-clock").addEventListener("click", () => {
    container.innerHTML = "";
    dlog(`Puzzle échoué: ${meta.title}`);
    if (onFail) onFail({ penalty: 50 });
  });
}
