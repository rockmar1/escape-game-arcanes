// admin.js
import { endGame, goToScreen, resetGame } from "./router.js";
import { resetScores, renderScores } from "./scoreboard.js";
import { dlog } from "./debug.js";

// Hash admin MD5 pour mot de passe "admin"
const ADMIN_PASSWORD_HASH = "21232f297a57a5a743894a0e4a801fc3"; 

export function initAdminPanel() {
  const btn = document.createElement("button");
  btn.id = "admin-toggle";
  btn.textContent = "⚙️ Admin";
  btn.style.position = "fixed";
  btn.style.bottom = "10px";
  btn.style.right = "10px";
  btn.style.zIndex = "1000";
  document.body.appendChild(btn);

  btn.addEventListener("click", () => {
    const pass = prompt("🔑 Entrez le mot de passe admin :");
    if (hashString(pass) === ADMIN_PASSWORD_HASH) {
      openAdminMenu();
    } else {
      alert("⛔ Mot de passe incorrect");
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
      <button id="reset-scores">🗑️ Reset Scores</button>
      <button id="show-scores">📊 Voir Scores</button>
      <button id="skip-mini">⏭️ Skip Mini-Jeu</button>
      <button id="toggle-debug">🔧 Debug Mode</button>
      <button id="close-admin">❌ Fermer</button>
    `;
    document.body.appendChild(panel);

    // Actions
    document.getElementById("force-victory").addEventListener("click", () => endGame(true));
    document.getElementById("force-defeat").addEventListener("click", () => endGame(false));
    document.getElementById("reset-scores").addEventListener("click", () => {
      resetScores();
      alert("✅ Scores réinitialisés");
    });
    document.getElementById("show-scores").addEventListener("click", () => renderScores());
    document.getElementById("skip-mini").addEventListener("click", () => {
      if (window.startNextMiniGame) {
        window.startNextMiniGame();
      } else {
        alert("Mini-jeu non disponible.");
      }
    });
    document.getElementById("toggle-debug").addEventListener("click", () => {
      console.log("🔧 Debug mode activé");
    });
    document.getElementById("close-admin").addEventListener("click", () => panel.remove());
  }
}

// Fonction de hash simple MD5 (CryptoJS doit être inclus dans le HTML)
function hashString(str) {
  return CryptoJS.MD5(str).toString();
}
