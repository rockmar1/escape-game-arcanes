// register puzzles metadata; file field = module filename in same folder
export const Puzzles = [
  { id:"runes", zone:"zone-bibliotheque", title:"🔮 Runes anciennes", file:"puzzleRunes.js" },
  { id:"texteInverse", zone:"zone-bibliotheque", title:"📜 Texte inversé", file:"puzzleTextInverse.js" },
  { id:"potions", zone:"zone-laboratoire", title:"⚗️ Potion mystique", file:"puzzlePotions.js" },
  { id:"labyrinthe", zone:"zone-laboratoire", title:"🌀 Labyrinthe magique", file:"puzzleLabyrinth.js" },
  { id:"etoiles", zone:"zone-observatoire", title:"✨ Constellation", file:"puzzleStars.js" },
  { id:"cristaux", zone:"zone-observatoire", title:"💎 Cristaux sonores", file:"puzzleCrystals.js" },
  { id:"horloge", zone:"zone-observatoire", title:"⏳ Horloge enchantée", file:"puzzleClock.js" }
];

import { loadAndMount } from "./loader.js";
import { GameState } from "../state.js";

/** initPuzzles() — fills each zone with randomized puzzle buttons */
export function initPuzzles(){
  const order = [...Puzzles].sort(()=>Math.random()-0.5);
  order.forEach(p=>{
    const zone = document.querySelector(`#${p.zone} .puzzles`);
    if(!zone) return;
    const btn = document.createElement("button");
    btn.className = "puzzle-btn";
    btn.textContent = p.title;
    btn.dataset.id = p.id;
    btn.addEventListener("click", ()=> loadAndMount(p));
    zone.appendChild(btn);
  });
  if(GameState.debug) console.log("[DBG] puzzles initialized", order.map(p=>p.id));
}
