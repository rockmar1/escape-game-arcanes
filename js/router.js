import { getPlayerName, debugLog, setScore, getScore } from "./state.js";
import { playAudio } from "./audio.js";

let currentScreen = "pseudo";

// === Changement d’écran ===
export function goToScreen(screen) {
  debugLog(`➡️ Passage à l’écran : ${screen}`);

  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  document.querySelector(`#screen-${screen}`).classList.remove("hidden");

  currentScreen = screen;

  if (screen === "intro") playAudio("intro");
  if (screen === "game") playAudio("ambiance");
  if (screen === "victory") playAudio("victoire");
  if (screen === "defeat") playAudio("defaite");
}

// === Initialisation ===
export function initRouter() {
  goToScreen("pseudo"); // par défaut
}

// === Fin de partie ===
export function endGame(victory = true) {
  if (victory) {
    document.getElementById("victory-text").textContent =
      `Bravo ${getPlayerName()} ! Score final : ${getScore()}`;
    goToScreen("victory");
  } else {
    document.getElementById("defeat-text").textContent =
      `Hélas ${getPlayerName()}... le royaume s’effondre.`;
    goToScreen("defeat");
  }
}
