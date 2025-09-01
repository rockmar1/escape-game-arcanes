// puzzleRunes.js
import { dlog, dwarn } from "../debug.js";

export function mount({ meta, onSolved, onFail }) {
  const container = document.getElementById("puzzle-container");
  if (!container) { dwarn("Aucun container pour puzzleRunes"); return; }
  container.innerHTML = "";
  dlog(`Mount puzzle: ${meta.title}`);

  const puzzleEl = document.createElement("div");
  puzzleEl.className = "puzzle";
  puzzleEl.innerHTML = `
    <p>🔮 Déchiffrez les runes anciennes !</p>
    <button id="solve-runes">Résoudre</button>
    <button id="fail-runes">Échouer</button>
  `;
  container.appendChild(puzzleEl);

  document.getElementById("solve-runes").addEventListener("click", () => {
    container.innerHTML = "";
    dlog(`Puzzle résolu: ${meta.title}`);
    if (onSolved) onSolved({ score: 50 });
  });

  document.getElementById("fail-runes").addEventListener("click", () => {
    container.innerHTML = "";
    dlog(`Puzzle échoué: ${meta.title}`);
    if (onFail) onFail({ penalty: 25 });
  });
}
