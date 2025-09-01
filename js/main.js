import { initRouter, goToScreen, startNextMiniGame } from "./router.js";
import { setPlayerName } from "./state.js";
import { dlog } from "./debug.js";
import { initAdminPanel } from "./admin.js";
import { initAudioOnUserGesture } from "./audio.js";

document.addEventListener("DOMContentLoaded", () => {
  dlog("🎮 Initialisation du jeu...");

  // HUD caché au départ
  const hud = document.getElementById("hud");
  if(hud) hud.classList.add("hidden");

  // Initialisation router
  initRouter();

  // Admin panel
  initAdminPanel();

  const startBtn = document.getElementById("start-btn");
  const beginBtn = document.getElementById("begin-game");

  // Premier clic utilisateur -> init audio
  document.body.addEventListener("click", function firstClickHandler(){
    initAudioOnUserGesture();
    document.body.removeEventListener("click", firstClickHandler);
  });

  // Entrer le pseudo
  startBtn.addEventListener("click", () => {
    const name = document.getElementById("player-name").value.trim();
    if (!name) { alert("Entre un pseudo pour commencer !"); return; }
    setPlayerName(name);
    dlog("✅ Pseudo validé : "+name);
    goToScreen("intro");
    // Lancement de l’intro animée
    animateIntro(name);
  });

  // Lancer le jeu après l’intro
  beginBtn.addEventListener("click", () => {
    if(hud) hud.classList.remove("hidden");
    startNextMiniGame();
  });

  // Recommencer
  const restartBtns = [document.getElementById("restart-btn"), document.getElementById("restart-btn-2")];
  restartBtns.forEach(btn => {
    if(btn) btn.addEventListener("click", () => location.reload());
  });
});

// === Animations Intro ===
function animateIntro(playerName){
  const introContent = document.getElementById("intro-content");
  if(!introContent) return;
  introContent.textContent = "";
  const text = `Bienvenue ${playerName}, le royaume des arcanes t’attend...\nPrépare ton grimoire et tes sorts...`;
  let i=0;
  const interval = setInterval(()=>{
    introContent.textContent += text.charAt(i);
    i++;
    if(i>=text.length) clearInterval(interval);
  }, 50); // effet "plume"
}
