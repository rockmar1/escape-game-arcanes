// router.js : navigation écran, mini-jeux, timer
import { dlog, dwarn } from "./debug.js";
import { getPlayerName, setScore, getScore } from "./state.js";
import { playMusic, stopAllAudio, switchToStressAmbience, playActionEffect } from "./audio.js";
import { typeWriterEffect, intros, victoryMessages, defeatMessages } from "./plume.js";

// mini-jeux fictifs
import * as puzzleClock from "./puzzles/puzzleClock.js";
import * as puzzleCrystals from "./puzzles/puzzleCrystals.js";
import * as puzzleLabyrinth from "./puzzles/puzzleLabyrinth.js";
import * as puzzlePotions from "./puzzles/puzzlePotions.js";
import * as puzzleRunes from "./puzzles/puzzleRunes.js";
import * as puzzleStars from "./puzzles/puzzleStars.js";
import * as puzzleTextInverse from "./puzzles/puzzleTextInverse.js";

const puzzles = [
  puzzleClock,
  puzzleCrystals,
  puzzleLabyrinth,
  puzzlePotions,
  puzzleRunes,
  puzzleStars,
  puzzleTextInverse
];

let currentPuzzleIndex = 0;
let timerInterval = null;
let remaining = 0;
let timerRunning = false;

const DEFAULT_TOTAL_TIME = 600;
const STRESS_THRESHOLD = 300;

export function goToScreen(screenName) {
  const all = document.querySelectorAll(".screen");
  all.forEach(s => s.classList.add("hidden"));
  const screen = document.getElementById(`screen-${screenName}`);
  if (!screen) return dwarn(`Écran introuvable : ${screenName}`);
  screen.classList.remove("hidden");
  dlog(`goToScreen -> ${screenName}`);

  // Gestion audio
  if(screenName === "intro") playMusic("intro");
  else if(screenName === "game") playMusic("game");
  else if(screenName === "victory") playMusic("victoire", false);
  else if(screenName === "defeat") playMusic("defaite", false);

  // HUD visible sauf pseudo
  const hud = document.getElementById("hud");
  if (screenName !== "pseudo") hud.classList.remove("hidden");
}

export function initRouter() {
  dlog("initRouter -> écran pseudo");
  goToScreen("pseudo");
}

export function startTimer(totalSeconds = DEFAULT_TOTAL_TIME) {
  if (timerRunning) return;
  remaining = totalSeconds;
  timerRunning = true;
  const timerEl = document.getElementById("timer");
  timerInterval = setInterval(() => {
    remaining--;
    let min = Math.floor(remaining/60);
    let sec = remaining % 60;
    timerEl.textContent = `⏳ ${min}:${sec.toString().padStart(2,'0')}`;

    // stress / dernière minute
    if(remaining === STRESS_THRESHOLD) switchToStressAmbience();
    if(remaining <= 60) timerEl.classList.toggle("blink");

    if(remaining <=0){
      clearInterval(timerInterval);
      timerRunning = false;
      endGame(false);
    }
  },1000);
}

export function startNextMiniGame() {
  if(currentPuzzleIndex >= puzzles.length) return endGame(true);
  const puzzle = puzzles[currentPuzzleIndex];
  currentPuzzleIndex++;
  const container = document.getElementById("puzzle-container");
  if(!container) return dwarn("Aucun container pour mini-jeu");
  container.innerHTML = "";
  if(!puzzle || typeof puzzle.mount!=="function") return dwarn("Mini-jeu invalide");

  dlog(`Mount puzzle: Énigme ${currentPuzzleIndex}`);
  puzzle.mount({
    container,
    meta:{title:`Énigme ${currentPuzzleIndex}`},
    onSolved:({score}= {})=>{
      setScore(getScore()+ (score||0));
      startNextMiniGame();
    },
    onFail:({penalty}= {})=>{
      setScore(Math.max(0,getScore()-(penalty||0)));
      startNextMiniGame();
    }
  });
}

export function endGame(victory=true) {
  stopAllAudio();
  goToScreen(victory?"victory":"defeat");
}

export function resetGame() {
  currentPuzzleIndex=0;
  setScore(0);
  if(timerInterval){ clearInterval(timerInterval); timerInterval=null; timerRunning=false;}
  goToScreen("pseudo");
}
