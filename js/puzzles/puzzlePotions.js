export async function mount({ container, onSolved, onFail, meta }){
  const overlay = document.createElement("div"); overlay.className="puzzle-overlay";
  const box = document.createElement("div"); box.className="puzzle-container";
  box.innerHTML = `<h3>${meta.title}</h3><p>Glisse les ingrédients dans le bon ordre</p>`;
  const ingBox = document.createElement("div"); ingBox.style.display="flex"; ingBox.style.gap="8px";
  const ingredients = [{id:"WATER", label:"Eau"},{id:"FIRE",label:"Feu"},{id:"HERB",label:"Herbe"}].sort(()=>Math.random()-0.5);
  const beaker = document.createElement("div"); beaker.style.minHeight="60px"; beaker.style.border="2px dashed #fff"; beaker.style.marginTop="12px";
  ingredients.forEach(it=>{
    const d=document.createElement("div"); d.draggable=true; d.textContent=it.label; d.dataset.val=it.id; d.style.padding="6px"; d.style.border="1px solid #eee"; d.style.borderRadius="6px";
    d.addEventListener("dragstart", e=> e.dataTransfer.setData("text/plain", it.id));
    ingBox.appendChild(d);
  });
  beaker.addEventListener("dragover", e=> e.preventDefault());
  beaker.addEventListener("drop", e=> {
    const v = e.dataTransfer.getData("text/plain");
    if(!v) return;
    const pill = document.createElement("span"); pill.textContent = v; pill.style.margin="6px";
    beaker.appendChild(pill);
    beaker.dataset.seq = (beaker.dataset.seq ? beaker.dataset.seq + "," : "") + v;
  });
  box.appendChild(ingBox); box.appendChild(beaker);
  const ok=document.createElement("button"); ok.textContent="Valider"; const cancel=document.createElement("button"); cancel.textContent="Abandon";
  box.appendChild(ok); box.appendChild(cancel);
  overlay.appendChild(box); (container||document.body).appendChild(overlay);

  ok.addEventListener("click", ()=> {
    const seq = (beaker.dataset.seq || "").split(",").filter(Boolean).join(",");
    const sol = "WATER,FIRE,HERB";
    if(seq === sol){ onSolved && onSolved({ score:120 }); cleanup(); } else { alert("Mauvais mélange"); onFail && onFail({ penalty:20 }); }
  });
  cancel.addEventListener("click", ()=> { onFail && onFail({ penalty:10 }); cleanup(); });
  function cleanup(){ overlay.remove(); }
}
export function getAnswer(){ return "WATER,FIRE,HERB"; }
export function unmount(){}
