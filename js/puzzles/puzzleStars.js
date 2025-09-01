// puzzleStars.js
import { dlog, dwarn } from "../debug.js";

export function mount({ meta, onSolved, onFail }) {
  const container = document.getElementById("puzzle-container");
  if (!container) { dwarn("Aucun container pour puzzleStars"); return; }
  container.innerHTML = "";
  dlog(`Mount puzzle: ${meta.title}`);

  const puzzleEl = document.createElement("div");
  puzzleEl.className = "puzzle";
  puzzleEl.innerHTML = `
    <p>🌟 Connectez les étoiles dans le bon ordre !</p>
    <button id="solve-stars">Résoudre</button>
    <button id="fail-stars">Échouer</button>
  `;
  container.appendChild(puzzleEl);

  document.getElementById("solve-stars").addEventListener("click", () => {
    container.innerHTML = "";
    dlog(`Puzzle résolu: ${meta.title}`);
    if (onSolved) onSolved({ score: 40 });
  });

  document.getElementById("fail-stars").addEventListener("click", () => {
    container.innerHTML = "";
    dlog(`Puzzle échoué: ${meta.title}`);
    if (onFail) onFail({ penalty: 20 });
  });
}
