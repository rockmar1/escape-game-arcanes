import { showScreen } from "../router.js";
import { GameState, unlockZone, markSolved } from "../state.js";
import { log } from "../config.js";
import { getSolutions } from "../puzzleRegistry.js";

export async function loadAndMountPuzzle(meta){
  // dynamically import module
  const mod = await import(meta.module);
  // mount into a dedicated overlay area (module must export mount/unmount)
  await mod.mount({
    onSolved: (data)=>{
      markSolved(meta.id);
      // remove button from zone
      const btn = document.querySelector(`#${meta.zone} .puzzle-btn[data-id="${meta.id}"]`);
      if(btn) btn.remove();
      // unlock next zones by rules (example)
      if(meta.id === "runes") unlockZone("zone-labo");
      if(meta.id === "potions") unlockZone("zone-observatoire");
      // add score/time adjustments
      GameState.player.score += (data && data.score) || 100;
      document.getElementById("score-display").textContent = GameState.player.score;
      if(GameState.puzzlesSolved.length + 1 >= 7) {
        // all solved
        const solText = "Toutes les énigmes résolues !";
        document.getElementById("victory-story").textContent = solText;
        showScreen("screen-victory");
      } else {
        showScreen("screen-game");
      }
    },
    onFail: (data)=>{
      // penalty
      GameState.timer = Math.max(0, GameState.timer - ((data && data.penalty) || 30));
      document.getElementById("timer-display").textContent = GameState.timer;
      showScreen("screen-game");
    },
    meta
  });
  log("Puzzle loaded:", meta.id);
}
