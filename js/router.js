import { dlog, dwarn, derr } from "./debug.js";
import { getPlayerName, setScore, getScore } from "./state.js";
import { playActionEffect, stopAllAudio, switchToStressAmbience, switchToNormalAmbience } from "./audio.js";
import * as puzzleClock from "./puzzles/puzzleClock.js";
import * as puzzleCrystals from "./puzzles/puzzleCrystals.js";

const puzzles = [puzzleClock, puzzleCrystals /*... autres puzzles */];

let currentPuzzleIndex = 0;
let timerInterval = null;
let remaining = 0;
const DEFAULT_TOTAL_TIME = 600;
const STRESS_THRESHOLD = 300;

export function goToScreen(screenName){
  const all = document.querySelectorAll(".screen");
  if(!all.length){ derr("Aucun élément .screen !"); return; }
  const screenEl = document.getElementById("screen-"+screenName);
  if(!screenEl){ derr("Écran introuvable: "+screenName); return; }
  all.forEach(s=>s.classList.add("hidden"));
  screenEl.classList.remove("hidden");
  dlog("Écran affiché: #screen-"+screenName);
}

export function initRouter(){
  dlog("initRouter() -> écran pseudo");
  goToScreen("pseudo");
}

export function startTimer(totalSeconds=DEFAULT_TOTAL_TIME){
  remaining = totalSeconds;
  timerInterval = setInterval(()=>{
    remaining--;
    const el = document.getElementById("timer");
    if(el) el.textContent=`⏳ ${Math.floor(remaining/60)}:${String(remaining%60).padStart(2,"0")}`;
    if(remaining===STRESS_THRESHOLD) switchToStressAmbience();
    if(remaining<=0){ clearInterval(timerInterval); endGame(false); }
  },1000);
}

export function startNextMiniGame(){
  if(currentPuzzleIndex>=puzzles.length){ endGame(true); return; }
  const puzzleModule = puzzles[currentPuzzleIndex];
  const container = document.getElementById("puzzle-container");
  container.innerHTML=""; // nettoyage précédent
  currentPuzzleIndex++;

  if(!puzzleModule || typeof puzzleModule.mount!=="function"){ dwarn("Puzzle invalide"); return startNextMiniGame(); }

  dlog(`Mount puzzle: Énigme ${currentPuzzleIndex}`);
  puzzleModule.mount({
    container,
    onSolved: ({score}= {})=>{
      dlog(`Puzzle résolu: Énigme ${currentPuzzleIndex} (+${score||0})`);
      setScore(getScore() + (score||0));
      playActionEffect("bonus");
      setTimeout(()=>startNextMiniGame(),250);
    },
    onFail: ({penalty}= {})=>{
      dlog(`Puzzle échoué: Énigme ${currentPuzzleIndex} (-${penalty||0})`);
      setScore(Math.max(0,getScore()-(penalty||0)));
      playActionEffect("error");
      setTimeout(()=>startNextMiniGame(),250);
    }
  });
}

export function endGame(victory=true){
  clearInterval(timerInterval);
  stopAllAudio();
  goToScreen(victory?"victory":"defeat");
  // Musique finale
  const jingle=new Audio(`assets/audio/${victory?"victoire":"defaite"}.mp3`);
  jingle.play().catch(()=>{});
}

export function resetGame(){
  clearInterval(timerInterval);
  currentPuzzleIndex=0;
  setScore(0);
  stopAllAudio();
  switchToNormalAmbience();
  goToScreen("pseudo");
}
