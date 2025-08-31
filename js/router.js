import { getPlayerName, debugLog, getScore } from "./state.js";
import { playAudio } from "./audio.js";

let currentScreen = "pseudo";

// --- Liste des mini-jeux (ou logique générale) ---
const miniGames = ["screen-game"]; // ici tu as un écran unique "game"
let currentMiniGameIndex = 0;

// --- Changement d'écran ---
export function goToScreen(screen) {
  debugLog(`➡️ Passage à l’écran : ${screen}`);

  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  document.querySelector(`#${screen}`).classList.remove("hidden");

  currentScreen = screen;

  // jouer le son correspondant
  playAudio(screen);
}

// --- Initialisation du router ---
export function initRouter() {
  goToScreen("screen-pseudo");

  // Bouton pseudo
  const startBtn = document.getElementById("start-btn");
  startBtn.addEventListener("click", () => {
    const nameInput = document.getElementById("player-name");
    const name = nameInput.value.trim();
    if (!name) return alert("Merci de saisir ton nom !");
    getPlayerName(name); // stocke le nom dans state.js
    goToIntro();
  });

  // Bouton intro
  const beginGameBtn = document.getElementById("begin-game");
  beginGameBtn.addEventListener("click", () => {
    startNextMiniGame();
  });
}

// --- Intro ---
function goToIntro() {
  goToScreen("screen-intro");
  // On peut remplir le contenu du prologue
  const introContent = document.getElementById("intro-content");
  introContent.textContent = "Le royaume oublié a besoin de toi ! Prépare-toi à relever les énigmes.";
}

// --- Mini-jeux / écran principal ---
export function startNextMiniGame() {
  if (currentMiniGameIndex >= miniGames.length) {
    endGame(true); // fin de l’aventure → victoire
    return;
  }

  const nextGame = miniGames[currentMiniGameIndex];
  currentMiniGameIndex++;

  goToScreen(nextGame);

  // Exemple : initialisation du jeu
  const hudPlayer = document.getElementById("hud-player");
  hudPlayer.textContent = `Joueur : ${getPlayerName()}`;

  // Ici tu peux appeler la logique de puzzle / timer / score
}

// --- Fin de partie ---
export function endGame(victory = true) {
  if (victory) {
    document.getElementById("victory-text").textContent =
      `Bravo ${getPlayerName()} ! Score final : ${getScore()}`;
    goToScreen("screen-victory");
  } else {
    document.getElementById("defeat-text").textContent =
      `Hélas ${getPlayerName()}... le royaume s’effondre.`;
    goToScreen("screen-defeat");
  }
}
