export async function mount({ container, onSolved, onFail, meta }){
  const overlay = document.createElement("div"); overlay.className="puzzle-overlay";
  const box = document.createElement("div"); box.className="puzzle-container";
  const phrase = "EGIAM";
  box.innerHTML = `<h3>${meta.title}</h3><p>Décodage : remets le texte à l'endroit.</p>`;
  const p = document.createElement("div"); p.textContent = phrase; p.style.fontWeight="700"; p.style.margin="10px";
  const input = document.createElement("input"); input.placeholder="Ta réponse";
  const ok = document.createElement("button"); ok.textContent="Vérifier"; const cancel=document.createElement("button"); cancel.textContent="Annuler";
  box.appendChild(p); box.appendChild(input); box.appendChild(ok); box.appendChild(cancel);
  overlay.appendChild(box); (container||document.body).appendChild(overlay);

  ok.addEventListener("click", ()=> {
    if(input.value.trim().toUpperCase() === phrase.split("").reverse().join("")){ onSolved && onSolved({ score:80 }); cleanup(); }
    else { alert("Non"); onFail && onFail({ penalty:10 }); }
  });
  cancel.addEventListener("click", ()=> { onFail && onFail({ penalty:5 }); cleanup(); });

  function cleanup(){ overlay.remove(); }
}
export function getAnswer(){ return "MAGIE"; }
export function unmount(){}
