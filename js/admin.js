// js/admin.js
import { dlog } from "./debug.js";

// default ADMIN MD5("admin") - change to your own hash if needed
const ADMIN_HASH = "21232f297a57a5a743894a0e4a801fc3";

function md5(s){
  try { return CryptoJS.MD5(String(s)).toString(); } catch(e){ return null; }
}

export function initAdminPanel(){
  if(document.getElementById("admin-toggle-btn")) return;
  const btn = document.createElement("button");
  btn.id = "admin-toggle-btn";
  btn.textContent = "⚙️";
  btn.title = "Panneau admin";
  btn.style.position = "fixed";
  btn.style.bottom = "12px";
  btn.style.right = "12px";
  btn.style.zIndex = 3000;
  document.body.appendChild(btn);

  btn.addEventListener("click", ()=>{
    const pass = prompt("Mot de passe admin :");
    if(!pass) return;
    const h = md5(pass);
    if(!h) { alert("CryptoJS manquant"); return; }
    if(h === ADMIN_HASH){
      dlog("Admin auth OK");
      _openAdminUI();
    } else {
      alert("Mot de passe incorrect");
    }
  });
}

function _openAdminUI(){
  let panel = document.getElementById("admin-panel-ui");
  if(!panel){
    panel = document.createElement("div");
    panel.id = "admin-panel-ui";
    panel.style.position = "fixed";
    panel.style.top = "10px";
    panel.style.right = "10px";
    panel.style.zIndex = 4000;
    panel.style.background = "rgba(0,0,0,0.8)";
    panel.style.color = "#fff";
    panel.style.padding = "10px";
    panel.style.borderRadius = "8px";
    panel.innerHTML = `
      <h4 style="margin:6px 0 8px 0">🔮 Admin</h4>
      <div style="display:flex;flex-direction:column;gap:6px;">
        <button id="admin-skip">⏭ Skip puzzle</button>
        <button id="admin-reveal">🗝 Révéler réponse</button>
        <button id="admin-nightmare">😈 Cauchemar ON/OFF</button>
        <button id="admin-victory">🏆 Forcer victoire</button>
        <button id="admin-defeat">💀 Forcer défaite</button>
        <button id="admin-reset">🔁 Reset jeu</button>
        <button id="admin-stop">🔇 Stop musiques</button>
        <button id="admin-clear-scores">🧹 Clear scores</button>
      </div>
      <pre id="admin-debug-area" style="max-height:200px;overflow:auto;background:#111;padding:6px;margin-top:8px;font-family:monospace;"></pre>
    `;
    document.body.appendChild(panel);

    panel.querySelector("#admin-skip").onclick = ()=> window.skipCurrentPuzzle && window.skipCurrentPuzzle();
    panel.querySelector("#admin-reveal").onclick = ()=> window.revealCurrentAnswer && window.revealCurrentAnswer();
    panel.querySelector("#admin-nightmare").onclick = ()=> window.toggleNightmare && window.toggleNightmare();
    panel.querySelector("#admin-victory").onclick = ()=> window.endGame && window.endGame(true);
    panel.querySelector("#admin-defeat").onclick = ()=> window.endGame && window.endGame(false);
    panel.querySelector("#admin-reset").onclick = ()=> window.resetGame && window.resetGame();
    panel.querySelector("#admin-stop").onclick = ()=> window.stopAllMusic && window.stopAllMusic();
    panel.querySelector("#admin-clear-scores").onclick = ()=>{
      if(confirm("Effacer tous les scores ?")) {
        try { localStorage.removeItem("eg_scores_v1"); alert("Scores effacés"); } catch(e){ alert("Erreur"); }
      }
    };

    // update debug area regularly if getGameDebug exists
    setInterval(()=>{
      const da = document.getElementById("admin-debug-area");
      if(!da) return;
      try {
        const info = (window.getGameDebug ? window.getGameDebug() : { note: "no router debug" });
        da.textContent = JSON.stringify(info, null, 2);
      } catch(e) { da.textContent = String(e); }
    }, 800);
  } else {
    panel.style.display = (panel.style.display === "none") ? "block" : "none";
  }
}

// auto-init minimal (main will also call it)
if(document.readyState !== "loading"){
  // nothing - allow main to call initAdminPanel explicitly
}
