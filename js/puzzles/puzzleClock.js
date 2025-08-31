// pick time dropdown to set clock to midnight
export async function mount({onSolved,onFail,meta}){
  const overlay=document.createElement("div"); overlay.className="puzzle-overlay";
  overlay.innerHTML = `<div class="puzzle-container"><h3>${meta.title}</h3>
    <p>Règle l'horloge sur MINUIT</p>
    <select id="clock-select"><option>10:00</option><option>11:00</option><option>12:00</option></select>
    <div><button id="clock-check">Valider</button><button id="clock-cancel">Annuler</button></div></div>`;
  document.body.appendChild(overlay);
  overlay.querySelector("#clock-check").addEventListener("click", ()=>{
    const val = overlay.querySelector("#clock-select").value;
    if(val.startsWith("12")) { onSolved({score:90}); cleanup(); } else { alert("Pas minuit"); onFail({penalty:15}); }
  });
  overlay.querySelector("#clock-cancel").addEventListener("click", ()=>{ onFail({penalty:10}); cleanup(); });
  function cleanup(){ overlay.remove(); }
}
export function unmount(){}
