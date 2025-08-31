import { GameState, triggerVictory, unlockZone } from "./state.js";

const puzzles = [
  { id: "runes", zone: "zone-bibliotheque", text: "🔮 Runes anciennes", solution: "SOLVE" },
  { id: "texteInverse", zone: "zone-bibliotheque", text: "📜 Texte inversé", solution: "MAGIE" },
  { id: "potions", zone: "zone-labo", text: "⚗️ Potion mystique", solution: "ROUGE+BLEU=VIOLET" },
  { id: "labyrinthe", zone: "zone-labo", text: "🌀 Labyrinthe", solution: "SORTIE NORD" },
  { id: "etoiles", zone: "zone-observatoire", text: "✨ Constellations", solution: "ORION" },
  { id: "horloge", zone: "zone-observatoire", text: "⏳ Horloge enchantée", solution: "MINUIT" },
  { id: "cristaux", zone: "zone-observatoire", text: "💎 Cristaux sonores", solution: "DO-RE-MI" }
];

// Ajout boutons enigmes
puzzles.forEach(p => {
  const btn = document.createElement("button");
  btn.textContent = p.text;
  btn.onclick = () => playPuzzle(p);
  document.querySelector(`#${p.zone} .puzzles`).appendChild(btn);

  // Ajout solutions admin
  const li = document.createElement("li");
  li.textContent = `${p.text} → ${p.solution}`;
  document.getElementById("solutions-list").appendChild(li);
});

function playPuzzle(p) {
  const answer = prompt(`Énigme : ${p.text}\nEntre ta réponse`);
  if (answer && answer.toUpperCase() === p.solution.toUpperCase()) {
    solvePuzzle(p);
  } else {
    alert("Mauvaise réponse !");
  }
}

function solvePuzzle(p) {
  alert(`Énigme ${p.text} résolue !`);
  GameState.player.score += 100;
  document.getElementById("score-display").textContent = GameState.player.score;
  GameState.puzzlesSolved.push(p.id);
  document.querySelector(`#${p.zone} button`).remove();

  if (p.id === "runes") unlockZone("zone-labo");
  if (p.id === "potions") unlockZone("zone-observatoire");

  if (GameState.puzzlesSolved.length === puzzles.length) {
    triggerVictory("Toutes les énigmes ont été résolues !");
  }
}
