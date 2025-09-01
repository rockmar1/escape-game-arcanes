// puzzleClock.js
import { dlog, dwarn } from "../debug.js";

export function mount({ meta, onSolved, onFail }) {
  const container = document.getElementById("puzzle-container");
  if (!container) {
    dwarn("Aucun container pour le puzzle !");
    return;
  }

  // Nettoyer le container avant de créer le puzzle
  container.innerHTML = "";
  dlog(`Mount puzzle: ${meta.title}`);

  // Création d'un élément puzzle (exemple simple)
  const puzzleEl = document.createElement("div");
  puzzleEl.className = "puzzle";
  puzzleEl.innerHTML = `
    <p>🕰️ Résolvez l'énigme de l'horloge !</p>
    <button id="solve-clock">Résoudre</button>
    <button id="fail-clock">Échouer</button>
  `;
  container.appendChild(puzzleEl);

  // Bouton résoudre
  document.getElementById("solve-clock").addEventListener("click", () => {
    // Supprime le puzzle du DOM
    container.innerHTML = "";
    dlog(`Puzzle résolu: ${meta.title}`);
    if (onSolved) onSolved({ score: 90 });
  });

  // Bouton échouer
  document.getElementById("fail-clock").addEventListener("click", () => {
    container.innerHTML = "";
    dlog(`Puzzle échoué: ${meta.title}`);
    if (onFail) onFail({ penalty: 50 });
  });
}
