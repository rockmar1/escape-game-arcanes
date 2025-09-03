// router.js
import { dlog, dwarn, derr } from "./debug.js";
import { getPlayerName, getScore, setScore, getGameState, setGameState } from "./state.js";
import { initAudioOnUserGesture, playMusic, stopAllMusic, playSfx } from "./audio.js";
import { startTimer, stopTimer, updateTimerDisplay } from "./timer.js";
import * as puzzles from "./puzzles/index.js";

let currentPuzzleIndex = 0;

export function initRouter() {
  dlog("router.js chargé");
  goToScreen("pseudo");
}

export function goToScreen(screenName) {
  const allScreens = document.querySelectorAll(".screen");
  allScreens.forEach(s => s.classList.add("hidden"));

  const screen = document.getElementById(`screen-${screenName}`);
  if (!screen) {
    derr(`Écran introuvable: ${screenName}`);
    return;
  }
  screen.classList.remove("hidden");
  dlog(`Écran affiché : ${screenName}`);

  switch (screenName) {
    case "pseudo":
      stopAllMusic();
      break;
    case "intro":
      stopAllMusic();
      playMusic("intro");
      break;
    case "game":
      stopAllMusic();
      playMusic("game");
      break;
    case "victory":
      stopAllMusic();
      playMusic("victory");
      break;
    case "defeat":
      stopAllMusic();
      playMusic("defeat");
      break;
  }
}

// === Mini-jeux ===
export function startNextMiniGame() {
  const state = getGameState();
  if (state.skipNextPuzzle) {
    state.skipNextPuzzle = false;
    setGameState(state);
    currentPuzzleIndex++;
  }

  if (currentPuzzleIndex >= puzzles.list.length) {
    endGame(true);
    return;
  }

  const puzzleModule = puzzles.list[currentPuzzleIndex];
  currentPuzzleIndex++;
  goToScreen("game");

  puzzleModule.mount({
    meta: { title: `Énigme ${currentPuzzleIndex}` },
    onSolved: ({ score } = {}) => {
      setScore(getScore() + (score || 0));
      dlog(`Puzzle résolu (+${score || 0})`);
      startNextMiniGame();
    },
    onFail: ({ penalty } = {}) => {
      setScore(Math.max(0, getScore() - (penalty || 0)));
      dlog(`Puzzle échoué (-${penalty || 0})`);
      startNextMiniGame();
    }
  });
}

// === Fin de jeu ===
export function endGame(victory = true) {
  stopTimer();
  if (victory) goToScreen("victory");
  else goToScreen("defeat");
  dlog(`endGame appelé — victory: ${victory}`);
}
