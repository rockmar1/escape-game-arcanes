// drag & drop potion ingredients into beaker in correct order
export async function mount({onSolved,onFail,meta}){
  const overlay = makeOverlay(meta.title, "Glisse les ingrédients dans le bon ordre");
  const ingBox = document.createElement("div"); ingBox.style.display="flex"; ingBox.style.justifyContent="center"; ingBox.style.gap="12px";
  const ingredients = [{id:"WATER",label:"Eau"},{id:"FIRE",label:"Feu"},{id:"HERB",label:"Herbe"}].sort(()=>Math.random()-0.5);
  ingredients.forEach(it=>{
    const d = document.createElement("div"); d.draggable=true; d.textContent=it.label; d.dataset.val=it.id;
    d.style.padding="8px"; d.style.border="1px solid #fff"; d.style.borderRadius="8px";
    d.addEventListener("dragstart", e=> e.dataTransfer.setData("text/plain", it.id));
    ingBox.appendChild(d);
  });
  overlay.content.appendChild(ingBox);
  const beaker = document.createElement("div"); beaker.style.minHeight="60px"; beaker.style.border="2px dashed #fff"; beaker.style.marginTop="12px"; overlay.content.appendChild(beaker);
  const seq = [];
  beaker.addEventListener("dragover", e=> e.preventDefault());
  beaker.addEventListener("drop", e=>{
    const v = e.dataTransfer.getData("text/plain");
    if(!v) return;
    seq.push(v);
    const pill = document.createElement("span"); pill.textContent=v; pill.style.margin="6px"; beaker.appendChild(pill);
  });
  const ok=makeBtn("Valider"), cancel=makeBtn("Abandon"); overlay.content.appendChild(ok); overlay.content.appendChild(cancel);
  ok.addEventListener("click", ()=>{
    const sol = ["WATER","FIRE","HERB"].join(",");
    if(seq.join(",") === sol){ onSolved({score:120}); cleanup(); } else { alert("Mauvais mélange"); onFail({penalty:20}); }
  });
  cancel.addEventListener("click", ()=>{ onFail({penalty:10}); cleanup(); });
  function cleanup(){ overlay.remove(); }
}
function makeOverlay(title, subtitle){ const ov=document.createElement("div"); ov.className="puzzle-overlay"; ov.style.position="fixed"; ov.style.left=0; ov.style.top=0; ov.style.right=0; ov.style.bottom=0; ov.style.display="flex"; ov.style.alignItems="center"; ov.style.justifyContent="center"; const box=document.createElement("div"); box.className="puzzle-container"; box.style.width="480px"; const h=document.createElement("h3"); h.textContent=title; box.appendChild(h); const s=document.createElement("p"); s.textContent=subtitle; box.appendChild(s); ov.appendChild(box); document.body.appendChild(ov); return {overlay:ov, content:box, remove:()=>ov.remove()}; }
function makeBtn(t){ const b=document.createElement("button"); b.textContent=t; b.style.margin="8px"; return b; }
export function unmount(){}
