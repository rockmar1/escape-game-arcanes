export async function mount({onSolved,onFail,meta}){
  const overlay = makeOverlay(meta.title, "Décodage : remets le texte à l'endroit.");
  const phrase = (meta && meta.id==="texteInverse") ? "EGIAM" : "TXET";
  const p = document.createElement("div"); p.textContent = phrase; p.style.fontWeight="700"; p.style.margin="10px";
  overlay.content.appendChild(p);
  const input = document.createElement("input"); input.placeholder="Ta réponse"; overlay.content.appendChild(input);
  const ok = makeBtn("Vérifier"), cancel = makeBtn("Annuler");
  overlay.content.appendChild(ok); overlay.content.appendChild(cancel);
  ok.addEventListener("click", ()=>{
    if(input.value.trim().toUpperCase() === phrase.split("").reverse().join("")){ onSolved({score:80}); cleanup(); }
    else { alert("Non"); onFail({penalty:10}); }
  });
  cancel.addEventListener("click", ()=>{ onFail({penalty:5}); cleanup(); });
  function cleanup(){ overlay.remove(); }
}
function makeOverlay(title, subtitle){ const ov=document.createElement("div"); ov.className="puzzle-overlay"; ov.style.position="fixed"; ov.style.left=0; ov.style.top=0; ov.style.right=0; ov.style.bottom=0; ov.style.display="flex"; ov.style.alignItems="center"; ov.style.justifyContent="center"; const box=document.createElement("div"); box.className="puzzle-container"; const h=document.createElement("h3"); h.textContent=title; box.appendChild(h); const s=document.createElement("p"); s.textContent=subtitle; box.appendChild(s); ov.appendChild(box); document.body.appendChild(ov); return {overlay:ov, content:box, remove:()=>ov.remove()}; }
function makeBtn(t){ const b=document.createElement("button"); b.textContent=t; b.style.margin="6px"; return b; }
export function unmount(){}
