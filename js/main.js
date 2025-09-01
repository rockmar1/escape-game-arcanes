import { initRouter, goToScreen, startNextMiniGame } from "./router.js";
import { setPlayerName } from "./state.js";
import { dlog, derr, dash, wireClick, assertEl, runDiagnostics, wrapGoToScreen, setDebug } from "./debug.js";
import "./admin.js";
import "./audio.js";

// =====================
// Initialisation
// =====================
document.addEventListener("DOMContentLoaded", () => {
  dash("BOOT");
  // Active le mode verbeux si la checkbox admin existe
  const dbgChk = document.getElementById("debug-mode");
  if (dbgChk) {
    setDebug(dbgChk.checked);
    dbgChk.addEventListener("change", () => setDebug(dbgChk.checked));
  }

  // Handler global d’erreurs pour voir tout dans #debug-log
  window.addEventListener("error", (e) => {
    derr("window.onerror:", e.message, "at", e.filename + ":" + e.lineno + ":" + e.colno);
  });
  window.addEventListener("unhandledrejection", (e) => {
    derr("Unhandled Promise Rejection:", e.reason);
  });

  dlog("🎮 Initialisation du jeu…");
  initRouter();

  // Diagnostics de base
  runDiagnostics();

  // Sécuriser goToScreen avec un wrapper de debug (pour les appels depuis main.js)
  const safeGoToScreen = wrapGoToScreen(goToScreen);

  // Récupère les éléments
  const nameInput = assertEl("player-name", "input pseudo");
  const startBtnOk = wireClick("start-btn", () => {
    dlog("Handler start-btn: début");
    if (!nameInput) {
      derr("Impossible de lire le pseudo: #player-name introuvable");
      return;
    }
    const name = nameInput.value.trim();
    dlog("Pseudo saisi =", JSON.stringify(name));
    if (!name) {
      alert("Entre un pseudo pour commencer !");
      derr("Pseudo vide → arrêt");
      return;
    }
    try {
      setPlayerName(name);
      dlog("setPlayerName OK:", name);
    } catch (e) {
      derr("setPlayerName a échoué:", e);
    }

    // Passage Intro
    try {
      const introTxt = assertEl("intro-content", "texte intro");
      if (introTxt) introTxt.textContent = `Bienvenue ${name}, le royaume t’attend…`;
      safeGoToScreen("intro");
      dlog("Navigation vers intro demandée");
    } catch (e) {
      derr("Erreur pendant goToScreen('intro'):", e);
    }
  });

  if (!startBtnOk) {
    derr("Le listener sur #start-btn n’a PAS pu être attaché (élément manquant ?).");
  }

  // Bouton "Entrer dans le royaume" (lancement puzzles)
  const beginOk = wireClick("begin-game", () => {
    dlog("Handler begin-game: début");
    try {
      // Démarre la suite (router enchaîne les mini-jeux)
      startNextMiniGame();
      dlog("startNextMiniGame() appelé");
    } catch (e) {
      derr("startNextMiniGame() a levé:", e);
    }
  });

  if (!beginOk) {
    derr("Le listener sur #begin-game n’a PAS pu être attaché (élément manquant ?).");
  }
});
