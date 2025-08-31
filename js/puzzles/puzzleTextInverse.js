import { showScreen } from "../router.js";
export async function mount({onSolved,onFail,meta}){
  const overlay = document.createElement("div"); overlay.className="puzzle-overlay";
  const phrase = "EGIAM"; // inverse of MAGIE
  overlay.innerHTML = `<div class="puzzle-container">
    <h3>${meta.title}</h3>
    <p>Décoder le texte inversé :</p>
    <div id="inverse-area">${phrase}</div>
    <input id="inverse-input" placeholder="Tape la réponse">
    <div><button id="inv-check">Vérifier</button><button id="inv-cancel">Annuler</button></div>
  </div>`;
  document.body.appendChild(overlay);
  overlay.querySelector("#inv-check").addEventListener("click", ()=>{
    const val = overlay.querySelector("#inverse-input").value.trim().toUpperCase();
    if(val === "MAGIE"){ onSolved({score:80}); cleanup(); } else { alert("Non"); onFail({penalty:15}); }
  });
  overlay.querySelector("#inv-cancel").addEventListener("click", ()=>{ onFail({penalty:10}); cleanup(); });
  function cleanup(){ overlay.remove(); }
}
export function unmount(){}
