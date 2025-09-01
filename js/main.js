import { initRouter, goToScreen, startNextMiniGame } from "./router.js";
import { setPlayerName } from "./state.js";

document.addEventListener("DOMContentLoaded", ()=>{
  initRouter();

  const startBtn = document.getElementById("start-btn");
  const beginBtn = document.getElementById("begin-game");

  startBtn.addEventListener("click", ()=>{
    const name = document.getElementById("player-name").value.trim();
    if(!name){ alert("Entrez un pseudo !"); return; }
    setPlayerName(name);
    document.getElementById("intro-content").textContent = `Bienvenue ${name}, le royaume t’attend...`;
    goToScreen("intro");
  });

  beginBtn.addEventListener("click", ()=>{
    goToScreen("game");
    startNextMiniGame();
  });

  // Admin toggle
  const adminToggle = document.getElementById("admin-toggle");
  const adminPanel = document.getElementById("admin-panel");
  if(adminToggle && adminPanel){
    adminToggle.addEventListener("click", ()=> adminPanel.classList.toggle("hidden"));
  }
});
