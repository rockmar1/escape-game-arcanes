// main.js
import { initRouter, startNextMiniGame, goToScreen } from "./router.js";
import { setScore, getScore } from "./state.js";
import { dlog, dwarn, derr } from "./debug.js";
import { initAudioOnUserGesture, playAudioForScreen } from "./audio.js";
import "./admin.js"; // Panel admin activé

// ==========================
// Initialisation DOM
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  dlog("🎮 Initialisation du jeu...");

  initRouter();

  const startBtn = document.getElementById("start-btn");
  const beginBtn = document.getElementById("begin-game");
  const playerInput = document.getElementById("player-name");

  if (!startBtn || !beginBtn || !playerInput) {
    derr("Éléments #start-btn, #begin-game ou #player-name introuvables !");
    return;
  }

  dlog("✅ Boutons et input trouvés");

  // Premier clic utilisateur -> initialisation audio globale
  document.body.addEventListener("click", () => {
    dlog("🖱️ Premier clic utilisateur détecté -> initAudioOnUserGesture()");
    try { initAudioOnUserGesture(); } catch(e){ dwarn("initAudioOnUserGesture() failed:", e); }
  }, { once: true });

  // ==========================
  // Start bouton pseudo
  // ==========================
  startBtn.addEventListener("click", () => {
    const name = playerInput.value.trim();
    if (!name) { alert("Entre un pseudo pour commencer !"); return; }
    dlog(`🖱️ Clic sur #start-btn\nPseudo saisi: ${name}`);

    // Affichage HUD joueur
    document.getElementById("hud-player").textContent = `👤 ${name}`;
    goToScreen("intro");
    document.getElementById("intro-content").textContent = `Bienvenue ${name}, le royaume t’attend...`;

    // Joue la musique d’intro
    try { playAudioForScreen("intro"); } catch(e){ dwarn("playAudioForScreen() failed:", e); }
  });

  // ==========================
  // Begin bouton intro
  // ==========================
  beginBtn.addEventListener("click", () => {
    dlog("🖱️ Clic sur #begin-game -> début aventure");
    goToScreen("game");

    // Dès le début du jeu, start musique principale
    try { playAudioForScreen("game"); } catch(e){ dwarn("playAudioForScreen() failed:", e); }

    // Démarre le premier mini-jeu
    startNextMiniGame();
  });
});
