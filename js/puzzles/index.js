import { Puzzles } from "../puzzleRegistry.js";
import { loadAndMountPuzzle } from "./loader.js";
import { log } from "../config.js";

// populate zones with puzzle buttons (random order)
export function initPuzzles(){
  const order = [...Puzzles].sort(()=>Math.random()-0.5);
  order.forEach(p=>{
    const zone = document.querySelector(`#${p.zone} .puzzles`);
    if(!zone) return;
    const btn = document.createElement("button");
    btn.className="puzzle-btn";
    btn.textContent = p.title;
    btn.dataset.id = p.id;
    btn.addEventListener("click", async ()=>{
      await loadAndMountPuzzle(p);
    });
    zone.appendChild(btn);
  });
  log("Puzzles initialized");
}
