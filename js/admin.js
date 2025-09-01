import { endGame, startNextMiniGame, resetGame } from "./router.js";
import { dlog } from "./debug.js";

const ADMIN_PASSWORD="admin"; // mot de passe clair

export function initAdminPanel(){
  const btn=document.createElement("button");
  btn.id="admin-toggle"; btn.textContent="⚙️ Admin";
  btn.style.position="fixed"; btn.style.bottom="10px"; btn.style.right="10px"; btn.style.zIndex="1000";
  document.body.appendChild(btn);

  btn.addEventListener("click", ()=>{
    const pass=prompt("🔑 Mot de passe admin:");
    if(pass!==ADMIN_PASSWORD){ alert("⛔ Mot de passe incorrect"); return; }
    openAdminMenu();
  });
}

function openAdminMenu(){
  let panel=document.getElementById("admin-panel");
  if(panel) return;
  panel=document.createElement("div"); panel.id="admin-panel";
  panel.style.position="fixed"; panel.style.bottom="50px"; panel.style.right="10px"; panel.style.padding="15px";
  panel.style.background="rgba(0,0,0,0.9)"; panel.style.color="white"; panel.style.zIndex="1000"; panel.style.borderRadius="8px";
  panel.innerHTML=`
    <h4>⚙️ Panneau Admin</h4>
    <button id="skip-puzzle">⏭️ Skip puzzle</button>
    <button id="show-solution">💡 Solution puzzle</button>
    <button id="force-victory">✅ Forcer victoire</button>
    <button id="force-defeat">❌ Forcer défaite</button>
    <button id="reset-game">🔄 Reset jeu</button>
    <button id="close-admin">❌ Fermer</button>
  `;
  document.body.appendChild(panel);

  document.getElementById("skip-puzzle").addEventListener("click", ()=>startNextMiniGame());
  document.getElementById("show-solution").addEventListener("click", ()=>alert("Solution: ...")); // à compléter
  document.getElementById("force-victory").addEventListener("click", ()=>endGame(true));
  document.getElementById("force-defeat").addEventListener("click", ()=>endGame(false));
  document.getElementById("reset-game").addEventListener("click", ()=>resetGame());
  document.getElementById("close-admin").addEventListener("click", ()=>panel.remove());
}
