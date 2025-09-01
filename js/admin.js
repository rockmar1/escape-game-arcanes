import { endGame, resetGame } from "./router.js";

const ADMIN_PASSWORD = "admin"; // mot de passe simple pour l'instant

export function initAdminPanel() {
  const btn = document.createElement("button");
  btn.id = "admin-toggle";
  btn.textContent = "⚙️ Admin";
  document.body.appendChild(btn);

  btn.addEventListener("click", ()=>{
    const pass = prompt("🔑 Mot de passe admin");
    if (pass !== ADMIN_PASSWORD) { alert("⛔ Incorrect"); return; }
    openAdminMenu();
  });
}

function openAdminMenu() {
  if (document.getElementById("admin-panel")) return;
  const panel = document.createElement("div");
  panel.id = "admin-panel";
  panel.innerHTML = `
    <h4>⚙️ Admin</h4>
    <button id="force-victory">✅ Victoire</button>
    <button id="force-defeat">❌ Défaite</button>
    <button id="reset-game">🔄 Reset</button>
    <button id="close-admin">❌ Fermer</button>
  `;
  document.body.appendChild(panel);

  document.getElementById("force-victory").onclick = ()=>endGame(true);
  document.getElementById("force-defeat").onclick = ()=>endGame(false);
  document.getElementById("reset-game").onclick = ()=>resetGame();
  document.getElementById("close-admin").onclick = ()=>panel.remove();
}
