import { endGame, startNextMiniGame, resetGame } from "./router.js";

// === Mot de passe admin ===
const ADMIN_PASSWORD = "admin";

// === Initialisation panel admin ===
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
    if (pass === ADMIN_PASSWORD) openAdminMenu();
    else alert("⛔ Mot de passe incorrect");
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
      <button id="skip-mini">⏭️ Skip Mini-Jeu</button>
      <button id="show-solutions">📜 Solutions complètes</button>
      <button id="force-victory">✅ Forcer Victoire</button>
      <button id="force-defeat">❌ Forcer Défaite</button>
      <button id="reset-game">🔄 Reset Partie</button>
      <button id="close-admin">❌ Fermer</button>
    `;
    document.body.appendChild(panel);

    // Actions
    document.getElementById("skip-mini").addEventListener("click", startNextMiniGame);
    document.getElementById("show-solutions").addEventListener("click", () => alert("Solutions complètes ici !"));
    document.getElementById("force-victory").addEventListener("click", () => endGame(true));
    document.getElementById("force-defeat").addEventListener("click", () => endGame(false));
    document.getElementById("reset-game").addEventListener("click", resetGame);
    document.getElementById("close-admin").addEventListener("click", () => panel.remove());
  }
}
