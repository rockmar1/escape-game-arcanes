import { endGame, goToScreen, startAdventure } from "./router.js";
import { resetScores } from "./scoreboard.js";
import { stopAllMusic } from "./audio.js";
import { log } from "./debug.js";

// Hash MD5 de "admin"
const ADMIN_HASH = "21232f297a57a5a743894a0e4a801fc3";

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
    const pass = prompt("🔑 Mot de passe admin ?");
    if (CryptoJS.MD5(pass).toString() === ADMIN_HASH) {
      log("Admin auth ok");
      openAdminMenu();
    } else {
      alert("⛔ Mot de passe incorrect");
    }
  });
}

function openAdminMenu() {
  let panel = document.getElementById("admin-panel");
  if (panel) panel.remove();

  panel = document.createElement("div");
  panel.id = "admin-panel";
  panel.classList.add("admin-panel");

  panel.innerHTML = `
    <h4>⚙️ Panneau Admin</h4>
    <button id="force-victory">✅ Forcer Victoire</button>
    <button id="force-defeat">❌ Forcer Défaite</button>
    <button id="skip-puzzle">⏭️ Skip Puzzle</button>
    <button id="reset-scores">🗑️ Reset Scores</button>
    <button id="show-scores">📊 Voir Scores</button>
    <button id="stop-music">🔇 Stop Music</button>
    <button id="close-admin">❌ Fermer</button>
  `;
  document.body.appendChild(panel);

  // === Actions ===
  document.getElementById("force-victory").addEventListener("click", () => {
    log("Admin → Forcer Victoire");
    endGame(true);
  });

  document.getElementById("force-defeat").addEventListener("click", () => {
    log("Admin → Forcer Défaite");
    endGame(false);
  });

  document.getElementById("skip-puzzle").addEventListener("click", () => {
    log("Admin → Skip Puzzle");
    startAdventure();
  });

  document.getElementById("reset-scores").addEventListener("click", () => {
    resetScores();
    alert("✅ Scores réinitialisés");
  });

  document.getElementById("show-scores").addEventListener("click", () => {
    log("Admin → Affiche scores");
    goToScreen("scoreboard");
  });

  document.getElementById("stop-music").addEventListener("click", () => {
    log("Admin → stopAllMusic");
    stopAllMusic();
  });

  document.getElementById("close-admin").addEventListener("click", () => {
    panel.remove();
  });
}
