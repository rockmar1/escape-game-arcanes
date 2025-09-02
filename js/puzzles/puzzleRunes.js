export async function mount({ container, onSolved, onFail, meta }){
  const word = "MAGIE";
  const overlay = document.createElement("div"); overlay.className="puzzle-overlay";
  const box = document.createElement("div"); box.className="puzzle-container";
  box.innerHTML = `<h3>${meta.title}</h3><p>Forme le mot magique</p>`;
  const area = document.createElement("div"); area.style.margin="10px";
  const letters = word.split("").sort(()=>Math.random()-0.5);
  const seq = [];
  letters.forEach(ch=>{
    const b=document.createElement("button"); b.textContent=ch; b.style.margin="6px";
    b.addEventListener("click", ()=>{ seq.push(ch); b.disabled=true; });
    area.appendChild(b);
  });
  const chk=document.createElement("button"); chk.textContent="Valider"; const cancel=document.createElement("button"); cancel.textContent="Abandon";
  box.appendChild(area); box.appendChild(chk); box.appendChild(cancel);
  overlay.appendChild(box); (container||document.body).appendChild(overlay);

  chk.addEventListener("click", ()=> {
    if(seq.join("") === word){ onSolved && onSolved({ score:150 }); cleanup(); } else { alert("Ce n'est pas correct."); onFail && onFail({ penalty:15 }); }
  });
  cancel.addEventListener("click", ()=>{ onFail && onFail({ penalty:10 }); cleanup(); });
  function cleanup(){ overlay.remove(); }
}
export function getAnswer(){ return "MAGIE"; }
export function unmount(){}
