import { markSolved, unlockZone, addScore, GameState } from "../state.js";
import { showScreen } from "../router.js";
import { saveScore } from "../scoreboard.js";

export async function loadAndMount(meta){
  // meta.file relative to this folder
  try{
    const mod = await import(`./${meta.file}`);
    // mount returns a promise; pass callbacks
    await mod.mount({
      onSolved: (data={})=>{
        markSolved(meta.id);
        // remove button
        const btn = document.querySelector(`#${meta.zone} .puzzles .puzzle-btn[data-id="${meta.id}"]`);
        if(btn) btn.remove();
        // optional unlock rules
        if(meta.id === "runes") unlockZone("zone-laboratoire");
        if(meta.id === "potions") unlockZone("zone-observatoire");
        addScore(data.score||100);
        // record score if last puzzle
        if(GameState.puzzlesSolved.length === 7){
          saveScore({ name: GameState.player.name, score: GameState.player.score, time: GameState.timer, result: "Victoire" });
          showScreen("screen-end");
        } else showScreen("screen-game");
      },
      onFail: (data={})=>{
        GameState.timer = Math.max(0, GameState.timer - (data.penalty||20));
        const timerEl = document.getElementById("hud-timer");
        if(timerEl) timerEl.textContent = GameState.timer;
        showScreen("screen-game");
      },
      meta
    });
  } catch(e){
    console.error("Loader import failed", e);
    alert("Erreur chargement énigme");
  }
}
