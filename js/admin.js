import { endGame, goToScreen, resetGame } from "./router.js";
import { toggleDebug } from "./state.js";
import { resetScores, renderScores } from "./scoreboard.js";

// Hash MD5 du mot "admin" (à remplacer si tu veux un autre mot)
const ADMIN_PASSWORD_HASH = "f3ada405ce890b6f8204094deb12d8a8b";

// === Initialisation du panel admin ===
export function initAdminPanel() {
  // Crée le bouton admin flottant
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
      openAdminMenu();
    } else {
      alert("⛔ Mot de passe incorrect");
    }
  });
}

// === Affichage du panel admin ===
function openAdminMenu() {
  let panel = document.getElementById("admin-panel");
  if (panel) return; // panel déjà ouvert

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
  panel.style.display = "flex";
  panel.style.flexDirection = "column";
  panel.style.gap = "5px";

  panel.innerHTML = `
    <h4>⚙️ Panneau Admin</h4>
    <button id="force-victory">✅ Forcer Victoire</button>
    <button id="force-defeat">❌ Forcer Défaite</button>
    <button id="reset-scores">🗑️ Reset Scores</button>
    <button id="show-scores">📊 Voir Scores</button>
    <button id="toggle-debug">🔧 Debug Mode</button>
    <button id="close-admin">❌ Fermer</button>
  `;

  document.body.appendChild(panel);

  // Actions des boutons
  document.getElementById("force-victory").addEventListener("click", () => endGame(true));
  document.getElementById("force-defeat").addEventListener("click", () => endGame(false));
  document.getElementById("reset-scores").addEventListener("click", () => {
    resetScores();
    console.log("[ADMIN] Scores réinitialisés");
    alert("✅ Scores réinitialisés");
  });
  document.getElementById("show-scores").addEventListener("click", () => {
    renderScores();
    goToScreen("game"); // affiche scoreboard dans la zone de jeu
  });
  document.getElementById("toggle-debug").addEventListener("click", () => {
    toggleDebug(true);
    console.log("[ADMIN] Debug activé");
  });
  document.getElementById("close-admin").addEventListener("click", () => panel.remove());
}

// === Hash MD5 via CryptoJS (assure-toi d’inclure CryptoJS) ===
function hashString(str) {
  return CryptoJS.MD5(str).toString();
}
