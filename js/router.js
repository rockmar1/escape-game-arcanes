// js/router.js - navigation, game flow, puzzle sequencing
import { dlog, dwarn } from "./debug.js";
import { playMusic, stopAllMusic, playSfx, switchToNormalAmbience } from "./audio.js";
import { writeWithQuill } from "./plume.js";
import { getRandomIntro } from "./intro.js";
import { startTimer, stopTimer, addSeconds, halveRemaining, getRemaining } from "./timer.js";
import { setPlayerName, addScore, setScore, resetScore, getScore } from "./state.js";
import { addScoreEntry, renderScoreboardTo, loadScores, clearScores } from "./scoreboard.js";

// puzzles
import * as puzzleClock from "./puzzles/puzzleClock.js";
import * as puzzleCrystals from "./puzzles/puzzleCrystals.js";
import * as puzzleLabyrinth from "./puzzles/puzzleLabyrinth.js";
import * as puzzlePotions from "./puzzles/puzzlePotions.js";
import * as puzzleRunes from "./puzzles/puzzleRunes.js";
import * as puzzleStars from "./puzzles/puzzleStars.js";
import * as puzzleTextInverse from "./puzzles/puzzleTextInverse.js";
import * as puzzleSound from "./puzzles/puzzleSound.js";

const ALL_PUZZLES = [
  { id:"clock", mod:puzzleClock, title:"Horloge" },
  { id:"crystals", mod:puzzleCrystals, title:"Cristaux" },
  { id:"lab", mod:puzzleLabyrinth, title:"Labyrinthe" },
  { id:"potions", mod:puzzlePotions, title:"Potions" },
  { id:"runes", mod:puzzleRunes, title:"Runes" },
  { id:"stars", mod:puzzleStars, title:"Étoiles" },
  { id:"text", mod:puzzleTextInverse, title:"Texte Inversé" },
  { id:"sound", mod:puzzleSound, title:"Énigme Sonore" }
];

let queue = [];
let idx = 0;
let puzzleRunning = false;
let nightmareMode = false;

dlog("router.js chargé");

// expose some globals for admin fallback
window.skipCurrentPuzzle = skipCurrentPuzzle;
window.revealCurrentAnswer = revealCurrentAnswer;
window.toggleNightmare = toggleNightmare;
window.endGame = endGame;
window.resetGame = resetGame;
window.getGameDebug = getGameDebug;
window.getCurrentTrack = ()=>{ try { return window.getCurrentTrack && window.getCurrentTrack(); } catch(e){ return null; } };

// UI helpers
function showScreen(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  const el = document.getElementById("screen-"+id);
  if(!el){ dwarn("screen not found", id); return; }
  el.classList.add("active");
}

export function initRouter(){
  dlog("initRouter -> pseudo");
  loadScores();
  showScreen("pseudo");
  // hide hud initially
  const hud = document.getElementById("hud"); if(hud) hud.classList.add("hidden");
}

export function goToIntro(){
  showScreen("intro");
  playMusic("intro");
  const introEl = document.getElementById("intro-text");
  const txt = getRandomIntro();
  writeWithQuill(introEl, txt, { speed: 28 }).then(()=> {
    dlog("Intro finished");
  });
}

export function startAdventure(){
  // prepare randomized queue (pick 6 of available)
  queue = [...ALL_PUZZLES].sort(()=>Math.random()-0.5).slice(0, 6);
  idx = 0;
  puzzleRunning = false;
  resetScore();
  // show hud, start music
  showScreen("game");
  const hud = document.getElementById("hud"); if(hud) hud.classList.remove("hidden");
  setTimeout(()=> switchToNormalAmbience(), 150);
  startTimer(600, ()=> endGame(false), (rem)=>{ /* tick callback optional */ });
  startNextMiniGame();
}

export function startNextMiniGame(){
  if(puzzleRunning) { dlog("startNextMiniGame ignored - puzzleRunning"); return; }
  if(idx >= queue.length){
    dlog("All puzzles done -> victory");
    return endGame(true);
  }
  const item = queue[idx++];
  const mod = item.mod;
  dlog("Launching puzzle:", item.title);
  const area = document.getElementById("puzzle-container") || document.getElementById("game-area");
  if(area) area.innerHTML = ""; // remove previous overlay to avoid stacking
  puzzleRunning = true;

  try {
    mod.mount({
      meta: { id: item.id, title: item.title },
      container: area,
      onSolved: ({ score=100, bonus=0 }={})=>{
        addScore(score + (bonus||0));
        playSfx("correct");
        puzzleRunning = false;
        setTimeout(()=> startNextMiniGame(), 350);
      },
      onFail: ({ penalty=20, timePenalty=10 }={})=>{
        addScore(- (penalty||0));
        addSeconds(- (timePenalty||0));
        playSfx("error");
        puzzleRunning = false;
        setTimeout(()=> startNextMiniGame(), 350);
      }
    });
  } catch(e){
    dwarn("Puzzle mount error", e);
    puzzleRunning = false;
    setTimeout(()=> startNextMiniGame(), 500);
  }
}

export function skipCurrentPuzzle(){
  if(!puzzleRunning){ dwarn("No puzzle running"); return; }
  playSfx("portal");
  // simple effect: cancel and proceed
  // attempt to call unmount on current puzzle if provided
  // (we don't keep reference to module instance; puzzles should cleanup after calling onFail/onSolved)
  puzzleRunning = false;
  setTimeout(()=> startNextMiniGame(), 300);
}

export function revealCurrentAnswer(){
  // reveal answer of last puzzle (idx-1)
  const last = queue[idx-1];
  if(!last || !last.mod || typeof last.mod.getAnswer !== "function"){
    dwarn("No answer available for current puzzle");
    alert("Aucune réponse disponible pour ce puzzle.");
    return;
  }
  const ans = last.mod.getAnswer();
  alert("Réponse : " + ans);
}

export function toggleNightmare(){
  nightmareMode = !nightmareMode;
  if(nightmareMode) { halveRemaining(); dlog("Nightmare ON - time halved"); }
  else dlog("Nightmare OFF");
}

export function endGame(victory=true){
  stopTimer();
  stopAllMusic();
  if(victory) {
    playMusic("victory", { loop:false, volume: 0.8 });
    // save score and show victory screen
    const text = ["Le Royaume renaît sous une aube dorée.","Les bardes chanteront vos exploits.","La lumière triomphe grâce à toi."][Math.floor(Math.random()*3)];
    document.getElementById("victory-text").textContent = text;
    showScreen("victory");
    // save scoreboard entry
    const entry = { pseudo: document.getElementById("hud-player").textContent.replace("👤 ","") || "Anonyme", result: "victory", score: getScore(), time: document.getElementById("timer")?.textContent || "", date: new Date().toLocaleString() };
    addScoreEntry(entry);
    setTimeout(()=> { renderScoreboardTo("scoreboard-list"); showScreen("screen-scoreboard"); }, 2200);
  } else {
    playMusic("defeat", { loop:false, volume: 0.8 });
    const text = ["Les ténèbres engloutissent le royaume...","La flamme s'éteint.","La nuit triomphe."][Math.floor(Math.random()*3)];
    document.getElementById("defeat-text").textContent = text;
    showScreen("defeat");
    const entry = { pseudo: document.getElementById("hud-player").textContent.replace("👤 ","") || "Anonyme", result: "defeat", score: getScore(), time: document.getElementById("timer")?.textContent || "", date: new Date().toLocaleString() };
    addScoreEntry(entry);
    setTimeout(()=> { renderScoreboardTo("scoreboard-list"); showScreen("screen-scoreboard"); }, 2200);
  }
}

// small debug helper returned to admin
export function getGameDebug(){
  return {
    queueLength: queue.length,
    currentIndex: idx,
    puzzleRunning,
    nightmareMode,
    score: getScore(),
    remaining: getRemaining()
  };
}

export function resetGame(){
  stopTimer();
  resetScore();
  // clear puzzle area
  const area = document.getElementById("puzzle-container");
  if(area) area.innerHTML = "";
  // show pseudo screen
  showScreen("pseudo");
}
