// admin.js
import { endGame, goToScreen, stopAllMusic, startNextMiniGame } from "./router.js";
import { dlog, dwarn, derr } from "./debug.js";
import { resetScores, renderScores, revealAnswers } from "./scoreboard.js";
import { getGameState, setGameState } from "./state.js";

// Hash MD5 du mot de passe "admin"
const ADMIN_PASSWORD_HASH = "21232f297a57a5a743894a0e4a801fc3"; 

export function initAdminPanel() {
  const btn = document.createElement("button");
  btn.id = "admin-toggle";
  btn.textContent = "⚙️ Admin";
  btn.style.position = "fixed";
  btn.style.bottom = "10px";
  btn.style.right = "10px";
  btn.style.zIndex = "1000";
  btn.style.padding = "5px 10px";
  document.body.appendChild(btn);

  btn.addEventListener("click", async () => {
    const pass = prompt("🔑 Entrez le mot de passe admin :");
    if (!pass) return;

    if (hashString(pass) === ADMIN_PASSWORD_HASH) {
      dlog("Admin auth ok");
      openAdminMenu();
    } else {
      alert("⛔ Mot de passe incorrect");
      dwarn("Tentative admin échouée");
    }
  });
}

function openAdminMenu() {
  let panel = document.getElementById("admin-panel");
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "admin-panel";
    panel.style.position = "fixed";
    panel.style.bottom = "50px";
    panel.style.right = "10px";
    panel.style.padding = "15px";
    panel.style.background = "rgba(0,0,0,0.9)";
    panel.style.color = "white";
    panel.style.zIndex = "1000";
    panel.style.borderRadius = "8px";
    panel.style.maxWidth = "250px";

    panel.innerHTML = `
      <h4>⚙️ Panneau Admin</h4>
      <button id="force-victory">✅ Forcer Victoire</button>
      <button id="force-defeat">❌ Forcer Défaite</button>
      <button id="skip-puzzle">⏭️ Skip Mini-Jeu</button>
      <button id="reveal-answers">📖 Voir Réponses</button>
      <button id="reset-scores">🗑️ Reset Scores</button>
      <button id="close-admin">❌ Fermer</button>
    `;
    document.body.appendChild(panel);

    // Boutons actions
    document.getElementById("force-victory").addEventListener("click", () => {
      dlog("Admin: Forcer victoire");
      stopAllMusic();
      endGame(true);
    });

    document.getElementById("force-defeat").addEventListener("click", () => {
      dlog("Admin: Forcer défaite");
      stopAllMusic();
      endGame(false);
    });

    document.getElementById("skip-puzzle").addEventListener("click", () => {
      dlog("Admin: Skip mini-jeu");
      const state = getGameState();
      state.skipNextPuzzle = true;
      setGameState(state);
      startNextMiniGame();
    });

    document.getElementById("reveal-answers").addEventListener("click", () => {
      dlog("Admin: Revealing answers");
      revealAnswers();
    });

    document.getElementById("reset-scores").addEventListener("click", () => {
      dlog("Admin: Reset scores");
      resetScores();
      alert("✅ Scores réinitialisés");
    });

    document.getElementById("close-admin").addEventListener("click", () => {
      panel.remove();
      dlog("Admin panel closed");
    });
  }
}

// Fonction de hash MD5 (CryptoJS nécessaire)
function hashString(str) {
  return CryptoJS.MD5(str).toString();
}
