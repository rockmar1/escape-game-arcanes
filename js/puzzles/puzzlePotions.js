// puzzlePotions.js
import { dlog, dwarn } from "../debug.js";

export function mount({ meta, onSolved, onFail }) {
  const container = document.getElementById("puzzle-container");
  if (!container) { dwarn("Aucun container pour puzzlePotions"); return; }
  container.innerHTML = "";
  dlog(`Mount puzzle: ${meta.title}`);

  const puzzleEl = document.createElement("div");
  puzzleEl.className = "puzzle";
  puzzleEl.innerHTML = `
    <p>⚗️ Préparez la potion magique correcte !</p>
    <button id="solve-potions">Résoudre</button>
    <button id="fail-potions">Échouer</button>
  `;
  container.appendChild(puzzleEl);

  document.getElementById("solve-potions").addEventListener("click", () => {
    container.innerHTML = "";
    dlog(`Puzzle résolu: ${meta.title}`);
    if (onSolved) onSolved({ score: 60 });
  });

  document.getElementById("fail-potions").addEventListener("click", () => {
    container.innerHTML = "";
    dlog(`Puzzle échoué: ${meta.title}`);
    if (onFail) onFail({ penalty: 30 });
  });
}
