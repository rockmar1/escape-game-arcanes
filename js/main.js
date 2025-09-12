// main.js
import { dlog } from "./debug.js";
import { gameState } from "./state.js";
import { startGame } from "./router.js";

export function initMain() {
  dlog("App start");

  // formulaire pseudo
  const form = document.getElementById("pseudo-form");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const name = document.getElementById("pseudo-input").value.trim();
      if (name) {
        gameState.playerName = name;
        dlog("player name", name);
        startGame();
      }
    });
  }
}

export function startNextMiniGame() {
  dlog("startNextMiniGame appelé");
  gameState.currentMiniGame++;
  // Ici : logique de chargement du mini-jeu
}
