import { initRouter, goToScreen, startNextMiniGame } from "./router.js";
import { setPlayerName } from "./state.js";
import { initAudioOnUserGesture } from "./audio.js";

document.addEventListener("DOMContentLoaded",()=>{
  initRouter();

  const startBtn = document.getElementById("start-btn");
  const beginBtn = document.getElementById("begin-game");
  const inputName = document.getElementById("player-name");

  const firstClickHandler = ()=>{
    initAudioOnUserGesture();
    document.removeEventListener("click", firstClickHandler);
  };
  document.addEventListener("click", firstClickHandler);

  startBtn.addEventListener("click", ()=>{
    const name = inputName.value.trim();
    if(!name){ alert("Entre un pseudo!"); return; }
    setPlayerName(name);
    document.getElementById("intro-content").textContent = `Bienvenue ${name}, le royaume t'attend...`;
    goToScreen("intro");
  });

  beginBtn.addEventListener("click", ()=>{
    goToScreen("game");
    startNextMiniGame();
  });
});
