export async function mount({ container, onSolved, onFail, meta }){
  const overlay = document.createElement("div"); overlay.className="puzzle-overlay";
  const box = document.createElement("div"); box.className="puzzle-container";
  box.innerHTML = `<h3>${meta.title}</h3><p>Reproduis la séquence</p>`;
  const area = document.createElement("div"); area.style.display="flex"; area.style.gap="10px"; box.appendChild(area);
  const pads = [];
  ["Rouge","Vert","Bleu","Jaune"].forEach((c,i)=>{
    const d=document.createElement("div"); d.style.width="60px"; d.style.height="60px"; d.style.background=["#e74c3c","#2ecc71","#3498db","#f1c40f"][i]; d.style.borderRadius="8px"; d.style.cursor="pointer";
    area.appendChild(d); pads.push(d);
  });
  const seq = Array.from({length:5}, ()=> Math.floor(Math.random()*4));
  // play sequence visually
  seq.forEach((v,i)=> setTimeout(()=>{ pads[v].style.opacity=0.4; setTimeout(()=> pads[v].style.opacity=1,300); }, i*600));
  let user = [];
  pads.forEach((p, idx)=> p.addEventListener("click", ()=> { user.push(idx); if(user.length===seq.length) check(); }));
  const cancel=document.createElement("button"); cancel.textContent="Abandon"; box.appendChild(cancel);
  cancel.addEventListener("click", ()=> { onFail && onFail({ penalty:10 }); cleanup(); });

  function check(){ if(seq.every((v,i)=> v===user[i])){ onSolved && onSolved({ score:160 }); cleanup(); } else { alert("Erreur"); onFail && onFail({ penalty:20 }); cleanup(); } }
  overlay.appendChild(box); (container||document.body).appendChild(overlay);
  function cleanup(){ overlay.remove(); }
}
export function getAnswer(){ return "Séquence aléatoire — reproduire la séquence affichée"; }
export function unmount(){}
