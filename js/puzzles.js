import { GameState, triggerVictory } from "./state.js";

const puzzles = [
  { id: "runes", zone: "zone-bibliotheque", text: "Replace les runes" },
  { id: "potions", zone: "zone-labo", text: "Mélange la potion" },
  { id: "etoiles", zone: "zone-observatoire", text: "Trace la constellation" }
];

puzzles.forEach(p => {
  const btn = document.createElement("button");
  btn.textContent = p.text;
  btn.onclick = () => solvePuzzle(p);
  document.querySelector(`#${p.zone} .puzzles`).appendChild(btn);
});

function solvePuzzle(p) {
  alert(`Énigme ${p.id} résolue !`);
  GameState.player.score += 100;
  document.getElementById("score-display").textContent = GameState.player.score;
  GameState.puzzlesSolved.push(p.id);
  document.querySelector(`#${p.zone} button`).remove();

  if (GameState.puzzlesSolved.length === puzzles.length) {
    triggerVictory("Toutes les énigmes sont résolues !");
  }
}
