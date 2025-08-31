import { playActionEffect } from "../audio.js";
import { startNextMiniGame } from "../router.js";

export async function mount({onSolved,onFail,meta}) {
  const overlay = makeOverlay(meta.title, "Clique un chemin vers la sortie (case inférieure droite)");
  const grid = document.createElement("div"); grid.className="labyrinth-grid"; overlay.content.appendChild(grid);

  const size = 5;
  for(let i=0;i<size*size;i++){
    const c = document.createElement("div");
    c.className="labyrinth-cell";
    c.dataset.i=i;
    c.addEventListener("click", ()=> c.classList.toggle("path"));
    grid.appendChild(c);
  }

  const ok = makeBtn("Valider"), cancel = makeBtn("Abandon");
  overlay.content.appendChild(ok); overlay.content.appendChild(cancel);

  ok.addEventListener("click", ()=>{
    const selected = Array.from(grid.querySelectorAll(".labyrinth-cell.path")).map(n=>+n.dataset.i);
    if(selected.includes(size*size-1)) {
      playActionEffect("collect","item");
      onSolved({score:130});
      cleanup();
      startNextMiniGame();
    } else {
      playActionEffect("error");
      alert("La sortie n'est pas atteinte");
      onFail({penalty:20});
    }
  });

  cancel.addEventListener("click", ()=>{ playActionEffect("error"); onFail({penalty:10}); cleanup(); });

  function cleanup(){ overlay.remove(); }
}

function makeOverlay(title, subtitle){ 
  const ov=document.createElement("div"); ov.className="puzzle-overlay";
  ov.style.position="fixed"; ov.style.left=0; ov.style.top=0; ov.style.right=0; ov.style.bottom=0;
  ov.style.display="flex"; ov.style.alignItems="center"; ov.style.justifyContent="center";
  const box=document.createElement("div"); box.className="puzzle-container";
  const h=document.createElement("h3"); h.textContent=title; box.appendChild(h);
  const s=document.createElement("p"); s.textContent=subtitle; box.appendChild(s);
  ov.appendChild(box); document.body.appendChild(ov);
  return {overlay:ov, content:box, remove:()=>ov.remove()};
}

function makeBtn(txt){ const b=document.createElement("button"); b.textContent=txt; b.style.margin="6px"; return b; }
export function unmount(){}
