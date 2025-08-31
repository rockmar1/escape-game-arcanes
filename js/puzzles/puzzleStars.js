// show sequence flash then user clicks same order
export async function mount({onSolved,onFail,meta}){
  const overlay = document.createElement("div"); overlay.className="puzzle-overlay";
  overlay.innerHTML = `<div class="puzzle-container"><h3>${meta.title}</h3><div id="stars-area"></div>
    <div><button id="stars-cancel">Annuler</button></div></div>`;
  document.body.appendChild(overlay);

  const area = overlay.querySelector("#stars-area");
  const count = 6;
  const seq = Array.from({length:count}, ()=> Math.floor(Math.random()*count));
  // make star nodes
  for(let i=0;i<count;i++){
    const s = document.createElement("div"); s.className="star"; s.dataset.idx = i;
    s.style.display="inline-block"; s.style.width="40px"; s.style.height="40px"; s.style.margin="6px";
    s.style.background = "#222"; s.style.borderRadius="50%";
    area.appendChild(s);
  }
  // flash sequence
  const stars = Array.from(area.children);
  async function flash(){
    for(const i of seq){
      stars[i].style.background="#ffd700";
      await new Promise(r=>setTimeout(r,400));
      stars[i].style.background="#222";
    }
  }
  await flash();
  // user clicks to reproduce
  const userSeq = [];
  stars.forEach(s=> s.addEventListener("click", ()=>{ userSeq.push(+s.dataset.idx); if(userSeq.length===seq.length){ check(); } }));
  function check(){
    const ok = seq.every((v,i)=> v === userSeq[i]);
    if(ok){ onSolved({score:140}); cleanup(); } else { alert("Mauvais ordre"); onFail({penalty:20}); }
  }
  overlay.querySelector("#stars-cancel").addEventListener("click", ()=>{ onFail({penalty:10}); cleanup(); });
  function cleanup(){ overlay.remove(); }
}
export function unmount(){}
