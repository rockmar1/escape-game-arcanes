// admin.js
import { dlog } from "./debug.js";
import { endGame, resetGame } from "./router.js";
import { resetScores, renderScores } from "./scoreboard.js";

const ADMIN_PASSWORD_HASH = "f3ada405ce890b6f8204094deb12d8a8b"; // "admin" en MD5

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

  btn.addEventListener("click", () => {
    const pass = prompt("🔑 Entrez le mot de passe admin :");
    if (!pass) return;
    if (CryptoJS.MD5(pass).toString() === ADMIN_PASSWORD_HASH) {
      openAdminMenu();
      dlog("Admin auth ok");
    } else {
      alert("⛔ Mot de passe incorrect");
      dlog("Admin auth failed");
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
      <button id="close-admin">❌ Fermer</button>
    `;
    document.body.appendChild(panel);

    // Actions
    document.getElementById("force-victory").addEventListener("click", () => {
      endGame(true);
      dlog("Admin: force victory clicked");
    });
    document.getElementById("force-defeat").addEventListener("click", () => {
      endGame(false);
      dlog("Admin: force defeat clicked");
    });
    document.getElementById("reset-scores").addEventListener("click", () => {
      resetScores();
      alert("✅ Scores réinitialisés");
      dlog("Admin: reset scores clicked");
    });
    document.getElementById("show-scores").addEventListener("click", () => {
      renderScores();
      dlog("Admin: show scores clicked");
    });
    document.getElementById("close-admin").addEventListener("click", () => panel.remove());
  }
}
