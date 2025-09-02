import { debugLog } from "./debug.js";
import { playMusic, stopAllMusic } from "./audio.js";
import { getRandomIntro } from "./intro.js";
import { startTimer } from "./timer.js";

export function goToScreen(screen) {
  debugLog("goToScreen -> " + screen);

  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const target = document.getElementById("screen-" + screen);
  if (target) target.classList.add("active");

  stopAllMusic();
  playMusic(screen);

  if (screen === "intro") {
    const introText = document.getElementById("intro-text");
    if (introText) introText.textContent = getRandomIntro();
  }

  if (screen === "game") {
    startTimer(600, () => goToScreen("defeat"));
  }

  if (screen === "victory") {
    showRandomEnding(true);
  }

  if (screen === "defeat") {
    showRandomEnding(false);
  }
}

function showRandomEnding(victory) {
  const endingsVictory = [
    "Le royaume est sauvé, votre légende sera chantée pour l’éternité.",
    "La lumière triomphe, mais une ombre persiste au loin...",
    "Vous êtes acclamés héros, statues élevées à votre gloire."
  ];

  const endingsDefeat = [
    "Les ténèbres engloutissent le royaume...",
    "Votre sacrifice restera gravé, mais la nuit l’emporte.",
    "Le royaume s’effondre, et vos noms sombrent dans l’oubli."
  ];

  const text = victory
    ? endingsVictory[Math.floor(Math.random() * endingsVictory.length)]
    : endingsDefeat[Math.floor(Math.random() * endingsDefeat.length)];

  const element = document.getElementById("ending-text");
  if (element) element.textContent = text;

  debugLog("Fin affichée : " + text);
}
