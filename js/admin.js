import { endGame, startNextMiniGame, goToScreen } from './router.js';
import { stopAllMusic } from './audio.js';
import { dlog, dwarn } from './debug.js';
import { puzzles } from './state.js'; // tableau de tous les puzzles

const ADMIN_PASSWORD_HASH = "21232f297a57a5a743894a0e4a801fc3"; // "admin" en MD5

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
    const hash = CryptoJS.MD5(pass).toString();
    if (hash === ADMIN_PASSWORD_HASH) {
      dlog("Admin auth ok");
      openAdminMenu();
    } else {
      alert("⛔ Mot de passe incorrect");
      dwarn("Mot de passe admin incorrect");
    }
  });
}

function openAdminMenu() {
  let panel = document.getElementById("admin-panel");
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "admin-panel";
    panel.innerHTML = `
      <h4>⚙️ Panneau Admin</h4>
      <button id="force-victory">✅ Forcer Victoire</button>
      <button id="force-defeat">❌ Forcer Défaite</button>
      <button id="skip-mini">⏭️ Skip Mini-Jeu</button>
      <button id="show-answers">💡 Voir Réponses</button>
      <button id="close-admin">❌ Fermer</button>
    `;
    document.body.appendChild(panel);

    document.getElementById("force-victory").addEventListener("click", () => {
      stopAllMusic();
      endGame(true);
      dlog("Admin: Forcé victoire");
    });

    document.getElementById("force-defeat").addEventListener("click", () => {
      stopAllMusic();
      endGame(false);
      dlog("Admin: Forcé défaite");
    });

    document.getElementById("skip-mini").addEventListener("click", () => {
      stopAllMusic();
      startNextMiniGame();
      dlog("Admin: Mini-jeu suivant lancé");
    });

    document.getElementById("show-answers").addEventListener("click", () => {
      dlog("Admin: Réponses des puzzles:");
      puzzles.forEach((p, i) => {
        dlog(`Puzzle #${i+1}: ${p.meta?.answer || "Pas de réponse"}`);
      });
    });

    document.getElementById("close-admin").addEventListener("click", () => panel.remove());
  }
}
