import { showScreen } from "./router.js";

export const GameState = {
  player: { name: "", score: 0 },
  timer: 600,
  puzzlesSolved: [],
  victory: false,
  defeat: false
};

export function unlockZone(id) {
  const zone = document.getElementById(id);
  zone.classList.remove("locked");
  zone.classList.add("unlocked");
}

export function triggerVictory(text) {
  GameState.victory = true;
  document.getElementById("victory-story").textContent = text;
  showScreen("screen-victory");
}

export function triggerDefeat(text) {
  GameState.defeat = true;
  document.getElementById("defeat-story").textContent = text;
  showScreen("screen-defeat");
}
