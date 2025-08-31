// click-order runes (form a word)
import { showScreen } from "../router.js";
export async function mount({onSolved, onFail, meta}){
  showScreen("screen-game"); // we'll use an overlay element inside game screen
  // create overlay
  const overlay = document.createElement("div"); overlay.className="puzzle-overlay";
  overlay.innerHTML = `<div class="puzzle-container">
    <h3>${meta.title}</h3>
    <p>Clique les runes pour former le mot magique.</p>
    <div id="runes-area"></div>
    <div><button id="runes-submit">Valider</button> <button id="runes-cancel">Abandon</button></div>
  </div>`;
  document.body.appendChild(overlay);

  const word = "MAGIE";
  // generate shuffled letters
  const letters = word.split('').sort(()=>Math.random()-0.5);
  const area = overlay.querySelector("#runes-area");
  let seq = [];
  letters.forEach(ch=>{
    const el = document.createElement("button"); el.className="rune"; el.textContent=ch;
    el.addEventListener("click", ()=>{ seq.push(ch); el.disabled=true; });
    area.appendChild(el);
  });

  overlay.querySelector("#runes-submit").addEventListener("click", ()=>{
    if(seq.join("") === word){ onSolved({score:150}); cleanup(); } else { alert("Ce n'est pas correct."); onFail({penalty:20}); }
  });
  overlay.querySelector("#runes-cancel").addEventListener("click", ()=>{ onFail({penalty:10}); cleanup(); });

  function cleanup(){ overlay.remove(); }
}
export function unmount(){ /* handled by cleanup */ }
