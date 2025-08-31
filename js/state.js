// État global minimal
export const GameState = {
  player: { name: "", score: 0 },
  timer: 600,
  puzzlesSolved: [],
  zonesUnlocked: new Set(),
  victory: false,
  defeat: false,
  debug: false
};

export function unlockZone(id){
  const el = document.getElementById(id);
  if(el){ el.classList.remove("locked"); el.classList.add("unlocked"); GameState.zonesUnlocked.add(id); if(GameState.debug) console.log("[DBG] zone unlocked",id); }
}

export function markSolved(id){
  if(!GameState.puzzlesSolved.includes(id)){
    GameState.puzzlesSolved.push(id);
    if(GameState.debug) console.log("[DBG] puzzle solved",id);
  }
}

export function addScore(n){
  GameState.player.score += n;
  const el = document.getElementById("hud-score");
  if(el) el.textContent = GameState.player.score;
}
