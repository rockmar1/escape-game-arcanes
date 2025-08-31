// click-order runes to form word (visual)
export async function mount({onSolved,onFail,meta}){
  const word = (meta && meta.id==="runes") ? "MAGIE" : "ARCANE";
  const overlay = makeOverlay(meta.title, `Forme le mot magique (${word.length} lettres)`);
  const area = document.createElement("div");
  area.style.margin = "10px";
  overlay.content.appendChild(area);

  const letters = word.split("").sort(()=>Math.random()-0.5);
  const seq = [];
  letters.forEach(ch=>{
    const b = document.createElement("button");
    b.textContent = ch; b.style.margin="6px";
    b.addEventListener("click", ()=>{ seq.push(ch); b.disabled=true; });
    area.appendChild(b);
  });

  const chk = makeBtn("Valider"), cancel = makeBtn("Abandon");
  overlay.content.appendChild(chk); overlay.content.appendChild(cancel);
  chk.addEventListener("click", ()=>{
    if(seq.join("") === word){ onSolved({score:150}); cleanup(); } else { alert("Ce n'est pas correct."); onFail({penalty:15}); }
  });
  cancel.addEventListener("click", ()=>{ onFail({penalty:10}); cleanup(); });
  function cleanup(){ overlay.remove(); }
}

function makeOverlay(title, subtitle){
  const ov = document.createElement("div"); ov.className="puzzle-overlay";
  ov.style.position="fixed"; ov.style.left=0; ov.style.top=0; ov.style.right=0; ov.style.bottom=0; ov.style.display="flex";
  ov.style.alignItems="center"; ov.style.justifyContent="center"; ov.style.zIndex=9999;
  const box = document.createElement("div"); box.className="puzzle-container"; box.style.width="420px";
  const h = document.createElement("h3"); h.textContent = title; box.appendChild(h);
  const p = document.createElement("p"); p.textContent = subtitle; box.appendChild(p);
  ov.appendChild(box); document.body.appendChild(ov);
  return { overlay: ov, content: box, remove: ()=>ov.remove() };
}
function makeBtn(txt){ const b=document.createElement("button"); b.textContent=txt; b.style.margin="8px"; return b; }
export function unmount(){ /* removed in cleanup */ }
