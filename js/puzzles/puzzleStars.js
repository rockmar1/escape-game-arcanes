export async function mount({ container, onSolved, onFail, meta }){
  const overlay = document.createElement("div"); overlay.className="puzzle-overlay";
  const box = document.createElement("div"); box.className="puzzle-container";
  box.innerHTML = `<h3>${meta.title}</h3><p>Regarde la séquence, puis reproduis-la</p>`;
  const area = document.createElement("div"); area.style.display="flex"; area.style.gap="8px"; overlay.content = box;
  const n = 6; const seq = Array.from({length:n}, ()=> Math.floor(Math.random()*n));
  const nodes = [];
  for(let i=0;i<n;i++){ const s=document.createElement("div"); s.style.width="40px"; s.style.height="40px"; s.style.borderRadius="50%"; s.style.background="#333"; s.style.cursor="pointer"; area.appendChild(s); nodes.push(s); }
  box.appendChild(area);
  overlay.appendChild(box); (container||document.body).appendChild(overlay);
  for(let i=0;i<seq.length;i++){
    ((i)=> setTimeout(()=>{ nodes[seq[i]].style.background="#ffd700"; setTimeout(()=> nodes[seq[i]].style.background="#333",300); }, i*500))(i);
  }
  const user=[]; nodes.forEach((nd,idx)=> nd.addEventListener("click", ()=>{ user.push(idx); if(user.length===seq.length){ check(); } }));
  const cancel = document.createElement("button"); cancel.textContent="Abandon"; box.appendChild(cancel);
  cancel.addEventListener("click", ()=> { onFail && onFail({ penalty:10 }); cleanup(); });

  function check(){ const ok = seq.every((v,i)=> v===user[i]); if(ok){ onSolved && onSolved({ score:140 }); cleanup(); } else { alert("Mauvais ordre"); onFail && onFail({ penalty:20 }); cleanup(); } }
  function cleanup(){ overlay.remove(); }
}
export function getAnswer(){ return "Reproduire la séquence affichée"; }
export function unmount(){}
