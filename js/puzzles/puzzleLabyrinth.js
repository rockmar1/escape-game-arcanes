// clickable grid labyrinth; player clicks path to exit
export async function mount({onSolved,onFail,meta}){
  const overlay = document.createElement("div"); overlay.className="puzzle-overlay";
  overlay.innerHTML = `<div class="puzzle-container">
    <h3>${meta.title}</h3>
    <p>Trace un chemin vers la sortie (clique sur les cases).</p>
    <div class="labyrinth-grid" id="lab-grid"></div>
    <div><button id="lab-check">Valider</button><button id="lab-cancel">Annuler</button></div>
  </div>`;
  document.body.appendChild(overlay);

  const grid = overlay.querySelector("#lab-grid");
  const size = 5;
  const exitIndex = 24; // bottom-right
  // create cells
  for(let i=0;i<size*size;i++){
    const cell = document.createElement("div");
    cell.className="labyrinth-cell";
    cell.dataset.idx = i;
    cell.addEventListener("click", ()=> cell.classList.toggle("path"));
    grid.appendChild(cell);
  }
  overlay.querySelector("#lab-check").addEventListener("click", ()=>{
    const selected = Array.from(grid.querySelectorAll(".labyrinth-cell.path")).map(c=>+c.dataset.idx);
    // naive check: must include exitIndex
    if(selected.includes(exitIndex)) { onSolved({score:130}); cleanup(); } else { alert("La sortie n'est pas atteinte."); onFail({penalty:25}); }
  });
  overlay.querySelector("#lab-cancel").addEventListener("click", ()=>{ onFail({penalty:10}); cleanup(); });
  function cleanup(){ overlay.remove(); }
}
export function unmount(){}
