// puzzleCrystals.js
import { dlog, dwarn } from "../debug.js";

export function mount({ meta, onSolved, onFail }) {
  const container = document.getElementById("puzzle-container");
  if (!container) { dwarn("Aucun container pour puzzleCrystals"); return; }
  container.innerHTML = "";
  dlog(`Mount puzzle: ${meta.title}`);

  const puzzleEl = document.createElement("div");
  puzzleEl.className = "puzzle";
  puzzleEl.innerHTML = `
    <p💎 Alignez les cristaux magiques !</p>
    <button id="solve-crystals">Résoudre</button>
    <button id="fail-crystals">Échouer</button>
  `;
  container.appendChild(puzzleEl);

  document.getElementById("solve-crystals").addEventListener("click", () => {
    container.innerHTML = "";
    dlog(`Puzzle résolu: ${meta.title}`);
    if (onSolved) onSolved({ score: 80 });
  });

  document.getElementById("fail-crystals").addEventListener("click", () => {
    container.innerHTML = "";
    dlog(`Puzzle échoué: ${meta.title}`);
    if (onFail) onFail({ penalty: 40 });
  });
}
