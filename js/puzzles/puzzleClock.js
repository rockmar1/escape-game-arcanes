export async function mount({ container, onSolved, onFail, meta }){
  const overlay = document.createElement("div"); overlay.className="puzzle-overlay";
  const box = document.createElement("div"); box.className="puzzle-container";
  box.innerHTML = `<h3>${meta.title}</h3><p>Régle l'horloge sur MINUIT</p>`;
  const select = document.createElement("select");
  ["10:00","11:00","12:00"].forEach(v=> select.appendChild(new Option(v,v)));
  box.appendChild(select);
  const ok = document.createElement("button"); ok.textContent = "Valider";
  const cancel = document.createElement("button"); cancel.textContent = "Abandon";
  box.appendChild(ok); box.appendChild(cancel);
  overlay.appendChild(box);
  (container || document.body).appendChild(overlay);

  ok.addEventListener("click", ()=> {
    if(select.value.startsWith("12")){ onSolved && onSolved({ score:90 }); cleanup(); } else { alert("Ce n'est pas minuit"); onFail && onFail({ penalty:15 }); }
  });
  cancel.addEventListener("click", ()=> { onFail && onFail({ penalty:10 }); cleanup(); });

  function cleanup(){ overlay.remove(); }
}
export function getAnswer(){ return "12:00"; }
export function unmount(){ /* no-op */ }
