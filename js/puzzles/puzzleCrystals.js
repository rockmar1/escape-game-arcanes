// Simon-like crystals sounds (4 colors)
export async function mount({onSolved,onFail,meta}){
  const overlay=document.createElement("div"); overlay.className="puzzle-overlay";
  overlay.innerHTML=`<div class="puzzle-container"><h3>${meta.title}</h3><div id="crystals"></div>
    <div><button id="cryst-cancel">Annuler</button></div></div>`;
  document.body.appendChild(overlay);
  const colors=["#f00","#0f0","#00f","#ff0"];
  const area = overlay.querySelector("#crystals");
  colors.forEach((c,i)=>{ const d=document.createElement("div"); d.style.width="60px";d.style.height="60px";d.style.margin="6px";d.style.background=c; d.style.display="inline-block"; d.dataset.i=i; d.style.borderRadius="8px"; area.appendChild(d); });
  const seq = [];
  const user = [];
  // generate sequence gradually
  const len = 5;
  for(let i=0;i<len;i++) seq.push(Math.floor(Math.random()*4));
  // play sequence visually + aurally
  const nodes = Array.from(area.children);
  function playSeq(){
    seq.forEach((s,idx)=> setTimeout(()=>{ nodes[s].style.opacity=0.4; setTimeout(()=>nodes[s].style.opacity=1,300); new Audio('sons/etoile.mp3').play().catch(()=>{}); }, idx*600));
  }
  playSeq();
  nodes.forEach(n=> n.addEventListener("click", ()=>{
    user.push(+n.dataset.i);
    const idx=user.length-1;
    if(user[idx] !== seq[idx]) { alert("Erreur"); onFail({penalty:20}); cleanup(); return; }
    if(user.length === seq.length){ onSolved({score:160}); cleanup(); }
  }));
  overlay.querySelector("#cryst-cancel").addEventListener("click", ()=>{ onFail({penalty:10}); cleanup(); });
  function cleanup(){ overlay.remove(); }
}
export function unmount(){}
