export async function mount({ container, onSolved, onFail, meta }){
  const overlay = document.createElement("div"); overlay.className="puzzle-overlay";
  const box = document.createElement("div"); box.className="puzzle-container";
  box.innerHTML = `<h3>${meta.title}</h3><p>Clique un chemin vers la sortie (case inférieure droite)</p>`;
  const grid = document.createElement("div"); grid.style.display="grid"; grid.style.gridTemplateColumns="repeat(5,40px)"; grid.style.gap="6px";
  for(let i=0;i<25;i++){ const c=document.createElement("div"); c.style.width="40px"; c.style.height="40px"; c.style.background="#222"; c.style.cursor="pointer"; c.dataset.i=i; c.addEventListener("click", ()=> c.classList.toggle("path")); grid.appendChild(c); }
  box.appendChild(grid);
  const ok=document.createElement("button"); ok.textContent="Valider"; const cancel=document.createElement("button"); cancel.textContent="Abandon";
  box.appendChild(ok); box.appendChild(cancel);
  overlay.appendChild(box); (container||document.body).appendChild(overlay);

  ok.addEventListener("click", ()=> {
    const selected = Array.from(grid.querySelectorAll(".path")).map(n=>+n.dataset.i);
    if(selected.includes(24)){ onSolved && onSolved({ score:130 }); cleanup(); } else { alert("La sortie n'est pas atteinte"); onFail && onFail({ penalty:20 }); }
  });
  cancel.addEventListener("click", ()=> { onFail && onFail({ penalty:10 }); cleanup(); });
  function cleanup(){ overlay.remove(); }
}
export function getAnswer(){ return "Il faut inclure la cellule inférieure droite (index 24)"; }
export function unmount(){}
