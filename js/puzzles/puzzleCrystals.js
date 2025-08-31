// Simon-like crystals with sounds
export async function mount({onSolved,onFail,meta}){
  const overlay = makeOverlay(meta.title, "Reproduis la séquence lumineuse");
  const colors = ["#e74c3c","#2ecc71","#3498db","#f1c40f"];
  const area = document.createElement("div"); area.style.display="flex"; area.style.gap="12px"; overlay.content.appendChild(area);
  const pads = colors.map(c=>{ const d=document.createElement("div"); d.style.width="60px"; d.style.height="60px"; d.style.background=c; d.style.borderRadius="8px"; area.appendChild(d); return d; });
  const seq = []; const len=5; for(let i=0;i<len;i++) seq.push(Math.floor(Math.random()*4));
  // play sequence
  seq.forEach((v,i)=> setTimeout(()=>{ flash(pads[v]); new Audio('assets/audio/cristal.mp3').play().catch(()=>{}); }, i*600));
  const user=[];
  pads.forEach((p,idx)=> p.addEventListener("click", ()=>{ user.push(idx); if(user.length===seq.length) check(); }));
  function flash(n){ const prev=n.style.opacity; n.style.opacity=0.4; setTimeout(()=>n.style.opacity=prev,300); }
  function check(){ if(seq.every((v,i)=> v===user[i])){ onSolved({score:160}); cleanup(); } else { alert("Erreur"); onFail({penalty:20}); cleanup(); } }
  const cancel = makeBtn("Abandon"); overlay.content.appendChild(cancel); cancel.addEventListener("click", ()=>{ onFail({penalty:10}); cleanup(); });
  function cleanup(){ overlay.remove(); }
}
function makeOverlay(title, subtitle){ const ov=document.createElement("div"); ov.className="puzzle-overlay"; ov.style.position="fixed"; ov.style.left=0; ov.style.top=0; ov.style.right=0; ov.style.bottom=0; ov.style.display="flex"; ov.style.alignItems="center"; ov.style.justifyContent="center"; const box=document.createElement("div"); box.className="puzzle-container"; const h=document.createElement("h3"); h.textContent=title; box.appendChild(h); const s=document.createElement("p"); s.textContent=subtitle; box.appendChild(s); ov.appendChild(box); document.body.appendChild(ov); return {overlay:ov, content:box, remove:()=>ov.remove()}; }
function makeBtn(t){ const b=document.createElement("button"); b.textContent=t; b.style.margin="6px"; return b; }
export function unmount(){}
