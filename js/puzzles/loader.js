// loader.js
import * as puzzleStars from "./puzzleStars.js";
import * as puzzleRunes from "./puzzleRunes.js";
import * as puzzlePotions from "./puzzlePotions.js";

const puzzles = [puzzleStars, puzzleRunes, puzzlePotions];

export function loadRandomPuzzle() {
  const container = document.getElementById("puzzle-container");
  container.innerHTML = "";

  const randomPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];

  if (window.currentPuzzleUnmount) {
    try { window.currentPuzzleUnmount(); } catch(e) {}
  }

  if (randomPuzzle.mount) {
    randomPuzzle.mount(container);
  }

  if (randomPuzzle.unmount) {
    window.currentPuzzleUnmount = randomPuzzle.unmount;
  } else {
    window.currentPuzzleUnmount = () => { container.innerHTML = ""; };
  }
}
