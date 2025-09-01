import { endGame, goToScreen, resetGame } from "./router.js";

// Hash MD5 du mot de passe admin "admin"
const ADMIN_PASSWORD_HASH = "21232f297a57a5a743894a0e4a801fc3"; // MD5 "admin"

// === Initialisation du panel admin ===
export function initAdminPanel() {
  const btn = document.createElement("button");
  btn.id = "admin-toggle";
  btn.textContent = "⚙️ Admin";
  document.body.appendChild(btn);

  btn.addEventListener("click", () => {
    const pass = prompt("🔑 Entrez le mot de passe admin :");
    if (!pass || hashMD5(pass) !== ADMIN_PASSWORD_HASH) {
      alert("⛔ Mot de passe incorrect");
      return;
    }
    openAdminMenu();
  });
}

// === Ouverture du panel admin ===
function openAdminMenu() {
  let panel = document.getElementById("admin-panel");
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "admin-panel";
    panel.innerHTML = `
      <h4>⚙️ Panneau Admin</h4>
      <button id="force-victory">✅ Forcer Victoire</button>
      <button id="force-defeat">❌ Forcer Défaite</button>
      <button id="reset-game">🔄 Reset Jeu</button>
      <button id="close-admin">❌ Fermer</button>
    `;
    document.body.appendChild(panel);

    // Actions
    document.getElementById("force-victory").addEventListener("click", () => endGame(true));
    document.getElementById("force-defeat").addEventListener("click", () => endGame(false));
    document.getElementById("reset-game").addEventListener("click", () => resetGame());
    document.getElementById("close-admin").addEventListener("click", () => panel.remove());
  }
}

// === MD5 simplifié via CryptoJS ===
function hashMD5(str) {
  if (typeof CryptoJS === "undefined") {
    alert("CryptoJS manquant pour le hash admin !");
    return "";
  }
  return CryptoJS.MD5(str).toString();
}
