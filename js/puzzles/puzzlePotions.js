// drag & drop: ingredients into beaker in right order
export async function mount({onSolved,onFail,meta}){
  const overlay = document.createElement("div"); overlay.className="puzzle-overlay";
  overlay.innerHTML = `<div class="puzzle-container">
    <h3>${meta.title}</h3>
    <p>Glisse les ingrédients dans le bon ordre pour créer la potion.</p>
    <div id="ingredients">
      <div draggable="true" class="ing" data-val="WATER">Eau</div>
      <div draggable="true" class="ing" data-val="FIRE">Feu</div>
      <div draggable="true" class="ing" data-val="HERB">Herbe</div>
    </div>
    <div id="beaker" style="min-height:60px;border:1px dashed #fff;margin-top:10px;"></div>
    <div><button id="potions-check">Valider</button><button id="potions-cancel">Annuler</button></div>
  </div>`;
  document.body.appendChild(overlay);

  const beaker = overlay.querySelector("#beaker");
  const sequence = [];
  overlay.querySelectorAll(".ing").forEach(el=>{
    el.addEventListener("dragstart", (e)=> e.dataTransfer.setData("text/plain", el.dataset.val));
  });
  beaker.addEventListener("dragover", e=>e.preventDefault());
  beaker.addEventListener("drop", e=>{
    const v = e.dataTransfer.getData("text/plain");
    sequence.push(v);
    const pill = document.createElement("div"); pill.textContent = v; pill.style.display="inline-block"; pill.style.margin="4px";
    beaker.appendChild(pill);
  });
  overlay.querySelector("#potions-check").addEventListener("click", ()=>{
    const sol = ["WATER","FIRE","HERB"].join(",");
    if(sequence.join(",") === sol){ onSolved({score:120}); cleanup(); } else { alert("Potion instable !"); onFail({penalty:20}); }
  });
  overlay.querySelector("#potions-cancel").addEventListener("click", ()=>{ onFail({penalty:10}); cleanup(); });
  function cleanup(){ overlay.remove(); }
}
export function unmount(){}
