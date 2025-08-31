import { playActionEffect } from "../audio.js";
import { startNextMiniGame } from "../router.js";

export async function mount({onSolved,onFail,meta}) {
  const overlay = makeOverlay(meta.title, "Regarde la séquence, puis reproduis-la");
  const area = document.createElement("div"); area.style.display="flex"; area.style.gap="8px"; overlay.content.appendChild(area);

  const n=6; const seq = Array.from({length:n}, ()=> Math.floor(Math.random()*n));
  const nodes = [];
  for(let i=0;i<n;i++){ 
    const s=document.createElement("div"); s.style.width="40px"; s.style.height="40px"; s.style.borderRadius="50%"; s.style.background="#333";
    area.appendChild(s); nodes.push(s); 
  }

  for(let i=0;i<seq.length;i++){
    ((i)=> setTimeout(()=>{ 
      nodes[seq[i]].style.background="#ffd700"; 
      setTimeout(()=> nodes[seq[i]].style.background="#333",300);
      playActionEffect("collect","etoile");
    }, i*500))(i);
  }

  const user=[]; nodes.forEach((nd,idx)=> nd.addEventListener("click", ()=>{
    user.push(idx);
    if(user.length===seq.length) check();
  }));

  function check(){ 
    const ok = seq.every((v,i)=> v===user[i]); 
    if(ok){ playActionEffect("collect","etoile"); onSolved({score:140}); cleanup(); startNextMiniGame(); }
    else { playActionEffect("error"); alert("Mauvais ordre"); onFail({penalty:20}); cleanup(); }
  }

  const cancel=makeBtn("Abandon"); overlay.content.appendChild(cancel); cancel.addEventListener("click", ()=>{ playActionEffect("error"); onFail({penalty:10}); cleanup(); });
  function cleanup(){ overlay.remove(); }
}

function makeOverlay(title, subtitle){ 
  const ov=document.createElement("div"); ov.className="puzzle-overlay"; ov.style.position="fixed"; ov.style.left=0; ov.style.top=0; ov.style.right=0; ov.style.bottom=0; 
  ov.style.display="flex"; ov.style.alignItems="center"; ov.style.justifyContent="center";
  const box=document.createElement("div"); box.className="puzzle-container"; 
  const h=document.createElement("h3"); h.textContent=title; box.appendChild(h); 
  const s=document.createElement("p"); s.textContent=subtitle; box.appendChild(s); 
  ov.appendChild(box); document.body.appendChild(ov); 
  return {overlay:ov, content:box, remove:()=>ov.remove()}; 
}

function makeBtn(t){ const b=document.createElement("button"); b.textContent=t; b.style.margin="6px"; return b; }
export function unmount(){}
