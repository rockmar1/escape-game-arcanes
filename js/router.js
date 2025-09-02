import { playMusic, stopAllMusic } from "./audio.js";
import { typeWriterEffect } from "./plume.js";
import { startTimer, resetTimer } from "./timer.js";
import { logDebug } from "./debug.js";
import { saveScore, showScoreboard } from "./scoreboard.js";

let currentScreen = null;
let intros = [
  "📜 Dans les ombres d’un grimoire ancien, une prophétie oubliée s’éveille...",
  "🌙 La lune éclaire faiblement les pages, et chaque mot semble prendre vie...",
  "🔮 Une voix lointaine murmure, guidant votre destin vers l’inconnu..."
];

let victoryTexts = [
  "✨ Vous avez triomphé des arcanes obscures !",
  "🏆 Votre nom sera gravé dans les grimoires éternels.",
  "🌟 Les secrets de l’académie sont désormais vôtres."
];

let defeatTexts = [
  "💀 Les arcanes ont eu raison de vous...",
  "⏳ Le temps s’est écoulé, et l’oubli vous engloutit.",
  "☠️ La magie noire triomphe cette fois."
];

export function goToScreen(screen) {
  logDebug(`➡️ Transition -> ${screen}`);
  if (currentScreen) {
    document.getElementById(`screen-${currentScreen}`)?.classList.remove("active");
  }

  currentScreen = screen;
  const el = document.getElementById(`screen-${screen}`);
  if (el) el.classList.add("active");

  stopAllMusic();
  playMusic(screen);

  if (screen === "intro") {
    const introText = intros[Math.floor(Math.random() * intros.length)];
    const elText = document.getElementById("intro-text");
    typeWriterEffect(elText, introText, 50, () => {
      setTimeout(() => goToScreen("game"), 2000);
    });
  }

  if (screen === "game") {
    document.getElementById("hud").style.display = "flex";
    startTimer(600);
  }

  if (screen === "victory") {
    const text = victoryTexts[Math.floor(Math.random() * victoryTexts.length)];
    document.getElementById("victory-text").textContent = text;
    resetTimer();
    saveScore("victory");
    setTimeout(() => showScoreboard(), 3000);
  }

  if (screen === "defeat") {
    const text = defeatTexts[Math.floor(Math.random() * defeatTexts.length)];
    document.getElementById("defeat-text").textContent = text;
    resetTimer();
    saveScore("defeat");
    setTimeout(() => showScoreboard(), 3000);
  }
}

export function resetGame() {
  logDebug("🔄 Reset du jeu");
  resetTimer();
  goToScreen("pseudo");
}
