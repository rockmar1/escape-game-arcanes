import { dlog, dwarn, derr } from "./debug.js";
import { getPlayerName, setScore, getScore } from "./state.js";
import { initAudioOnUserGesture, playAudioForScreen, stopAllAudio, switchToStressAmbience, switchToNormalAmbience, playActionEffect } from "./audio.js";

// Puzzles
import * as puzzleClock from "./puzzles/puzzleClock.js";
import * as puzzleCrystals from "./puzzles/puzzleCrystals.js";
import * as puzzleLabyrinth from "./puzzles/puzzleLabyrinth.js";
import * as puzzlePotions from "./puzzles/puzzlePotions.js";
import * as puzzleRunes from "./puzzles/puzzleRunes.js";
import * as puzzleStars from "./puzzles/puzzleStars.js";
import * as puzzleTextInverse from "./puzzles/puzzleTextInverse.js";

const puzzles = [puzzleClock,puzzleCrystals,puzzleLabyrinth,puzzlePotions,puzzleRunes,puzzleStars,puzzleTextInverse];

let currentPuzzleIndex = 0;
let timerInterval = null;
let remaining = 0;
let timerRunning = false;
const DEFAULT_TOTAL_TIME = 600;
const STRESS_THRESHOLD = 300;

dlog("router.js chargé");

// --- Navigation écrans ---
export function goToScreen(screenName){
  const id = "screen-" + screenName;
  dlog(`goToScreen("${screenName}") demandé -> #${id}`);

  const all = document.querySelectorAll(".screen");
  if(!all || all.length===0){ derr("Aucun élément .screen trouvé !"); return; }

  const screenEl = document.getElementById(id);
  if(!screenEl){ derr(`Écran introuvable : #${id}`); return; }

  all.forEach(s=>s.classList.add("hidden"));
  screenEl.classList.remove("hidden");
  dlog(`Écran affiché : #${id}`);

  try { playAudioForScreen(screenName); } catch(e){ dwarn("playAudioForScreen() failed:", e); }

  if(screenName==="victory"||screenName==="defeat"){
    try { stopAllAudio(); } catch(e){ dwarn("stopAllAudio() failed:", e); }
    const jingle = screenName==="victory"?"assets/audio/victoire.mp3":"assets/audio/defaite.mp3";
    try { new Audio(jingle).play().catch(()=>{}); } catch(e){}
  }
}

// --- Router init ---
export function initRouter(){ dlog("initRouter() -> affichage écran pseudo"); goToScreen("pseudo"); }

// --- Timer ---
export function startTimer(totalSeconds=DEFAULT_TOTAL_TIME){
  if(timerRunning){ dlog("Timer déjà lancé"); return; }
  remaining = totalSeconds;
  timerRunning = true;
  updateTimerDisplay();
  dlog(`Timer démarré (${totalSeconds}s)`);

  timerInterval = setInterval(()=>{
    remaining--;
    updateTimerDisplay();
    if(totalSeconds>STRESS_THRESHOLD && remaining===STRESS_THRESHOLD){
      dlog("Seuil stress atteint -> switchToStressAmbience()");
      try{ switchToStressAmbience(); } catch(e){ dwarn(e); }
      const timerEl = document.getElementById("timer");
      if(timerEl) timerEl.classList.add("stress");
    }
    if(remaining<=0){
      clearInterval(timerInterval);
      timerRunning=false;
      endGame(false);
    }
  },1000);
}

function updateTimerDisplay(){
  const el = document.getElementById("timer");
  if(!el){ dwarn("Aucun #timer trouvé"); return; }
  const minutes = Math.floor(Math.max(0,remaining)/60);
  const seconds = Math.max(0,remaining)%60;
  el.textContent = `⏳ ${minutes}:${String(seconds).padStart(2,"0")}`;
}

// --- Mini-jeux ---
export function startNextMiniGame(){
  if(!timerRunning){
    dlog("Premier mini-jeu : démarrage timer");
    startTimer(DEFAULT_TOTAL_TIME);
    try{ initAudioOnUserGesture(); } catch(e){ dwarn("initAudioOnUserGesture() failed"); }
  }
  if(currentPuzzleIndex>=puzzles.length){ return endGame(true); }

  const puzzleModule = puzzles[currentPuzzleIndex++];
  dlog(`Lancement puzzle #${currentPuzzleIndex}`);
  goToScreen("game");

  if(!puzzleModule || typeof puzzleModule.mount!=="function"){
    derr(`Puzzle invalide index ${currentPuzzleIndex-1}`);
    setTimeout(()=>startNextMiniGame(),300);
    return;
  }

  try{
    puzzleModule.mount({
      meta:{title:`Énigme ${currentPuzzleIndex}`},
      onSolved:({score}={})=>{
        dlog(`Puzzle résolu (+${score||0})`);
        setScore(getScore()+(score||0));
        try{ playActionEffect("bonus"); } catch(e){}
        setTimeout(()=>startNextMiniGame(),250);
      },
      onFail:({penalty}={})=>{
        dlog(`Puzzle échoué (-${penalty||0})`);
        setScore(Math.max(0,getScore()-(penalty||0)));
        try{ playActionEffect("error"); } catch(e){}
        setTimeout(()=>startNextMiniGame(),250);
      }
    });
  }catch(e){ derr("Erreur mount puzzle:",e); setTimeout(()=>startNextMiniGame(),500); }
}

// --- Fin / reset ---
export function endGame(victory=true){
  dlog(`endGame(${victory}) appelé`);
  if(timerInterval){ clearInterval(timerInterval); timerInterval=null; timerRunning=false; }
  try{ stopAllAudio(); } catch(e){}
  goToScreen(victory?"victory":"defeat");
}

export function resetGame(){
  dlog("resetGame()");
  currentPuzzleIndex=0;
  if(timerInterval){ clearInterval(timerInterval); timerInterval=null; timerRunning=false; }
  setScore(0);
  try{ switchToNormalAmbience(); } catch(e){}
  goToScreen("pseudo");
}
