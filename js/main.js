// main.js
import { initRouter, goToScreen, startNextMiniGame } from "./router.js";
import { setPlayerName } from "./state.js";
import "./audio.js";
import { initAdminPanel } from "./admin.js";

document.addEventListener("DOMContentLoaded", () => {
  initRouter();
  initAdminPanel();

  const startBtn = document.getElementById("start-btn");
  const beginBtn = document.getElementById("begin-game");
  const playerInput = document.getElementById("player-name");

  startBtn.addEventListener("click", () => {
    const name = playerInput.value.trim();
    if(!name) return alert("Entre un pseudo !");
    setPlayerName(name);
    goToScreen("intro");
  });

  beginBtn.addEventListener("click", () => {
    goToScreen("game");
    startNextMiniGame();
  });
});
