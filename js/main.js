import { initRouter, goToScreen, startNextMiniGame, startTimer } from "./router.js";
import { setPlayerName, getPlayerName, setScore } from "./state.js";
import { initAdminPanel } from "./admin.js";

// === Intros multiples ===
const intros = [
  `Bienvenue {playerName}, le royaume t’attend...\nPrépare ton grimoire...`,
  `Ah, {playerName}, tu arrives juste à temps !\nLes arcanes sont agitées...`,
  `Salutations {playerName}, aventurier des runes...\nTon destin t’attend...`
];

// === Fins multiples ===
const victoryMessages = [
  "Félicitations !\nLe royaume est sauvé grâce à toi !",
  "Bravo !\nLes arcanes sont enfin apaisées !",
  "Victoire !\nTon courage a triomphé de toutes les épreuves !"
];

const defeatMessages = [
  "Défaite...\nLe royaume sombre dans le chaos...",
  "Hélas...\nLes arcanes ont eu raison de toi...",
  "Échec...\nLe grimoire reste incomplet..."
];

// Effet plume pour texte
function animateText(container, text) {
  container.textContent = "";
  container.classList.add("plume");
  text.split("").forEach((char, i) => {
    const span = document.createElement("span");
    span.textContent = char;
    span.style.animationDelay = (i * 0.05) + "s";
    container.appendChild(span);
  });
}

// Affiche une intro aléatoire
function showRandomIntro(playerName) {
  const introContent = document.getElementById("intro-content");
  const text = intros[Math.floor(Math.random() * intros.length)].replace("{playerName}", playerName);
  animateText(introContent, text);
}

// Affiche une fin aléatoire
function showRandomEnd(containerId, victory = true) {
  const container = document.getElementById(containerId);
  const messages = victory ? victoryMessages : defeatMessages;
  const text = messages[Math.floor(Math.random() * messages.length)];
  animateText(container, text);
}

// =====================
// Initialisation
// =====================
document.addEventListener("DOMContentLoaded", () => {
  initRouter();
  initAdminPanel();

  const startBtn = document.getElementById("start-btn");
  const beginBtn = document.getElementById("begin-game");
  const hud = document.getElementById("hud");
  hud.classList.add("hidden"); // HUD caché au départ

  startBtn.addEventListener("click", () => {
    const name = document.getElementById("player-name").value.trim();
    if (!name) {
      alert("Entre un pseudo pour commencer !");
      return;
    }
    setPlayerName(name);
    goToScreen("intro");
    hud.classList.add("hidden"); // toujours caché pendant intro
    showRandomIntro(name);
  });

  beginBtn.addEventListener("click", () => {
    goToScreen("game");
    hud.classList.remove("hidden"); // Affiche HUD
    const playerName = getPlayerName();
    document.getElementById("hud-player").textContent = `👤 ${playerName}`;
    setScore(0);
    startNextMiniGame();
    startTimer(); // démarre le timer global
  });

  // Écrans finaux
  const victoryScreenBtn = document.getElementById("victory-btn");
  if(victoryScreenBtn){
    victoryScreenBtn.addEventListener("click", () => {
      goToScreen("victory");
      showRandomEnd("victory-content", true);
    });
  }
  const defeatScreenBtn = document.getElementById("defeat-btn");
  if(defeatScreenBtn){
    defeatScreenBtn.addEventListener("click", () => {
      goToScreen("defeat");
      showRandomEnd("defeat-content", false);
    });
  }
});
