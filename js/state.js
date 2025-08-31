import { log } from "./config.js";
export const GameState = {
  player: { name:"", score:0 },
  timer: 0,
  puzzlesSolved: [],
  zonesUnlocked: new Set(),
  victory:false, defeat:false
};
export function unlockZone(id){
  const zone = document.getElementById(id);
  if(zone){ zone.classList.remove("locked"); zone.classList.add("unlocked"); GameState.zonesUnlocked.add(id); log("Zone unlocked", id); }
}
export function markSolved(puzzleId){
  if(!GameState.puzzlesSolved.includes(puzzleId)){
    GameState.puzzlesSolved.push(puzzleId);
    log("Puzzle solved:", puzzleId);
  }
}
