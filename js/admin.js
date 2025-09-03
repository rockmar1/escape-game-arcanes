// js/admin.js
import { dlog } from "./debug.js";
const ADMIN_HASH = "21232f297a57a5a743894a0e4a801fc3"; // MD5("admin")
function md5(s){ try{ return CryptoJS.MD5(String(s)).toString(); }catch(e){ return null; } }
export function initAdminPanel(){
  if(document.getElementById("admin-toggle-btn")) return;
  const btn=document.createElement("button"); btn.id="admin-toggle-btn"; btn.textContent="⚙️"; btn.style.position="fixed"; btn.style.bottom="12px"; btn.style.right="12px"; btn.style.zIndex=3000; document.body.appendChild(btn);
  btn.addEventListener("click", ()=>{
    const pass = prompt("Mot de passe admin :");
    if(!pass) return;
    const h = md5(pass);
    if(!h){ alert("CryptoJS manquant"); return; }
    if(h === ADMIN_HASH){ dlog("Admin auth ok"); openPanel(); } else { alert("Mot de passe incorrect"); }
  });
}
function openPanel(){
  let panel=document.getElementById("admin-panel-ui");
  if(!panel){
    panel=document.createElement("div"); panel.id="admin-panel-ui"; panel.style.position="fixed"; panel.style.top="10px"; panel.style.right="10px"; panel.style.zIndex=4000; panel.style.background="rgba(0,0,0,0.85)"; panel.style.color="#fff"; panel.style.padding="10px"; panel.style.borderRadius="8px";
    panel.innerHTML=`<h4 style="margin:6px 0">🔮 Admin</h4><div style="display:flex;flex-direction:column;gap:6px"><button id="admin-skip">⏭ Skip</button><button id="admin-reveal">🗝 Reveal</button><button id="admin-nightmare">😈 Cauchemar</button><button id="admin-victory">🏆 Victoire</button><button id="admin-defeat">💀 Défaite</button><button id="admin-reset">🔁 Reset</button><button id="admin-stop">🔇 Stop music</button><button id="admin-clear-scores">🧹 Clear scores</button></div><pre id="admin-debug" style="display:none;"></pre>`;
    document.body.appendChild(panel);
    panel.querySelector("#admin-skip").onclick = ()=> window.skipCurrentPuzzle && window.skipCurrentPuzzle();
    panel.querySelector("#admin-reveal").onclick = ()=> window.revealCurrentAnswer && window.revealCurrentAnswer();
    panel.querySelector("#admin-nightmare").onclick = ()=> window.toggleNightmare && window.toggleNightmare();
    panel.querySelector("#admin-victory").onclick = ()=> window.endGame && window.endGame(true);
    panel.querySelector("#admin-defeat").onclick = ()=> window.endGame && window.endGame(false);
    panel.querySelector("#admin-reset").onclick = ()=> window.resetGame && window.resetGame();
    panel.querySelector("#admin-stop").onclick = ()=> window.stopAllMusic && window.stopAllMusic();
    panel.querySelector("#admin-clear-scores").onclick = ()=> { if(confirm("Effacer scores locaux ?")){ localStorage.removeItem("eg_scores_v1"); alert("Scores effacés"); } };
  } else { panel.style.display = (panel.style.display === "none") ? "block" : "none"; }
}
