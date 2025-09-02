import { playSfx } from "../audio.js";

export async function mount({ container, onSolved, onFail, meta }){
  const overlay = document.createElement("div"); overlay.className="puzzle-overlay";
  const box = document.createElement("div"); box.className="puzzle-container";
  box.innerHTML = `<h3>${meta.title}</h3><p>Écoute le son puis choisis l'option correcte.</p>`;
  const btnPlay = document.createElement("button"); btnPlay.textContent = "▶ Écouter le son";
  box.appendChild(btnPlay);
  const choices = ["quill","portal","correct","error"];
  const choicesWrap = document.createElement("div"); choicesWrap.style.display="flex"; choicesWrap.style.gap="8px"; choicesWrap.style.marginTop="12px";
  choices.forEach(c=>{
    const b = document.createElement("button"); b.textContent = c; b.dataset.k = c; choicesWrap.appendChild(b);
    b.addEventListener("click", ()=>{
      const pick = b.dataset.k;
      if(pick === "portal"){ onSolved && onSolved({ score:120 }); cleanup(); } else { onFail && onFail({ penalty:15, timePenalty:10 }); cleanup(); }
    });
  });
  box.appendChild(choicesWrap);
  const cancel = document.createElement("button"); cancel.textContent="Abandon"; cancel.style.marginTop="12px";
  box.appendChild(cancel);
  overlay.appendChild(box); (container||document.body).appendChild(overlay);

  btnPlay.addEventListener("click", ()=> playSfx("portal", 0.9));
  cancel.addEventListener("click", ()=> { onFail && onFail({ penalty:10 }); cleanup(); });

  function cleanup(){ overlay.remove(); }
}
export function getAnswer(){ return "portal"; }
export function unmount(){}
