// admin.js
import { endGame, skipCurrentPuzzle, revealPuzzleSolution, resetGame } from "./router.js";

const ADMIN_PASSWORD_HASH = "f3ada405ce890b6f8204094deb12d8a8b";

export function initAdminPanel() {
  const btn = document.createElement("button");
  btn.id = "admin-toggle";
  btn.textContent = "⚙️ Admin";
  btn.style.position = "fixed";
  btn.style.bottom = "10px";
  btn.style.right = "10px";
  btn.style.zIndex = "1000";
  document.body.appendChild(btn);

  btn.addEventListener("click", async () => {
    const pass = prompt("Mot de passe admin:");
    if(md5(pass) === ADMIN_PASSWORD_HASH) openAdminMenu();
    else alert("Mot de passe incorrect");
  });
}

function openAdminMenu() {
  let panel = document.getElementById("admin-panel");
  if(panel) return;
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
    <button id="force-victory">Forcer Victoire</button>
    <button id="force-defeat">Forcer Défaite</button>
    <button id="reset-game">Reset Game</button>
    <button id="skip-puzzle">Skip Mini-jeu</button>
    <button id="reveal-puzzle">Révéler Puzzle</button>
    <button id="close-admin">Fermer</button>
  `;
  document.body.appendChild(panel);

  document.getElementById("force-victory").onclick = () => endGame(true);
  document.getElementById("force-defeat").onclick = () => endGame(false);
  document.getElementById("reset-game").onclick = () => resetGame();
  document.getElementById("skip-puzzle").onclick = () => skipCurrentPuzzle();
  document.getElementById("reveal-puzzle").onclick = () => revealPuzzleSolution();
  document.getElementById("close-admin").onclick = () => panel.remove();
}

// MD5 rapide
function md5(str) {
  return CryptoJS.MD5(str).toString();
}
