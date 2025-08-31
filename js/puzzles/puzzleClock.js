export async function mount({onSolved,onFail,meta}){
  const overlay = makeOverlay(meta.title, "Régle l'horloge sur MINUIT");
  const select = document.createElement("select"); ["10:00","11:00","12:00"].forEach(v=> select.appendChild(new Option(v,v)));
  overlay.content.appendChild(select);
  const ok=makeBtn("Valider"), cancel=makeBtn("Abandon");
  overlay.content.appendChild(ok); overlay.content.appendChild(cancel);
  ok.addEventListener("click", ()=> {
    if(select.value.startsWith("12")){ onSolved({score:90}); cleanup(); } else { alert("Ce n'est pas minuit"); onFail({penalty:15}); }
  });
  cancel.addEventListener("click", ()=>{ onFail({penalty:10}); cleanup(); });
  function cleanup(){ overlay.remove(); }
}
function makeOverlay(title, subtitle){ const ov=document.createElement("div"); ov.className="puzzle-overlay"; ov.style.position="fixed"; ov.style.left=0; ov.style.top=0; ov.style.right=0; ov.style.bottom=0; ov.style.display="flex"; ov.style.alignItems="center"; ov.style.justifyContent="center"; const box=document.createElement("div"); box.className="puzzle-container"; const h=document.createElement("h3"); h.textContent=title; box.appendChild(h); const s=document.createElement("p"); s.textContent=subtitle; box.appendChild(s); ov.appendChild(box); document.body.appendChild(ov); return {overlay:ov, content:box, remove:()=>ov.remove()}; }
function makeBtn(t){ const b=document.createElement("button"); b.textContent=t; b.style.margin="6px"; return b; }
export function unmount(){}
