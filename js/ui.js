// ui.js
import { state } from "./state.js";

export function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  const screen = document.getElementById(id);
  if (screen) {
    screen.classList.remove("hidden");
  }
}

export function updateHUD() {
  const hud = document.getElementById("hud-player");
  if (hud) hud.textContent = `Joueur : ${state.playerName} | Score : ${state.score}`;
}
