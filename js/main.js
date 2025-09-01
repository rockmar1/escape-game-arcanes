import { initRouter, goToScreen, startNextMiniGame, startTimer } from "./router.js";
import { setPlayerName } from "./state.js";
import { initAdminPanel } from "./admin.js";
import { typeWriterEffect, intros } from "./plume.js";

document.addEventListener("DOMContentLoaded", ()=>{
  initRouter();
  initAdminPanel();

  const pseudoForm = document.getElementById("pseudo-form");
  const pseudoInput = document.getElementById("pseudo-input");
  pseudoForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    const name = pseudoInput.value.trim();
    if(!name) return alert("Entrez un pseudo !");
    setPlayerName(name);

    goToScreen("intro");
    const introContent = document.getElementById("intro-content");
    const randomIntro = intros[Math.floor(Math.random()*intros.length)];
    typeWriterEffect(introContent, `Bienvenue ${name} !\n${randomIntro}`, 50);
  });

  document.getElementById("begin-game").addEventListener("click",()=>{
    goToScreen("game");
    startTimer();
    startNextMiniGame();
  });
});
