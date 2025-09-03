// js/main.js
import { dlog } from "./debug.js";
import { initAdminPanel } from "./admin.js";
import * as Router from "./router.js";
import { initAudioOnUserGesture } from "./audio.js";
import { renderScoreboardTo, loadScores } from "./scoreboard.js";

document.addEventListener("DOMContentLoaded", ()=>{
  dlog("App start");
  initAdminPanel();
  Router.initRouter();

  // prime audio on first click
  document.body.addEventListener("click", ()=> initAudioOnUserGesture(), { once:true });

  const startBtn = document.getElementById("start-btn");
  const pseudoInput = document.getElementById("pseudo-input");
  const beginBtn = document.getElementById("begin-game");
  const skipIntro = document.getElementById("skip-intro");
  const replayV = document.getElementById("btn-replay-v");
  const replayD = document.getElementById("btn-replay-d");
  const gotoScore = document.getElementById("goto-scoreboard");
  const gotoScoreD = document.getElementById("goto-scoreboard-d");
  const replayScore = document.getElementById("btn-replay-score");
  const clearBtn = document.getElementById("btn-clear-scores");

  startBtn?.addEventListener("click", async ()=>{
    const name = (pseudoInput.value||"Aventurier").trim();
    const { setPlayerName } = await import("./state.js");
    setPlayerName(name);
    Router.goToIntro();
  });

  beginBtn?.addEventListener("click", ()=> Router.startAdventure());
  skipIntro?.addEventListener("click", ()=> Router.startAdventure());
  replayV?.addEventListener("click", ()=> window.resetGame && window.resetGame());
  replayD?.addEventListener("click", ()=> window.resetGame && window.resetGame());
  gotoScore?.addEventListener("click", ()=> { renderScoreboardTo("scoreboard-list"); document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active")); document.getElementById("screen-scoreboard").classList.add("active");});
  gotoScoreD?.addEventListener("click", ()=> { renderScoreboardTo("scoreboard-list"); document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active")); document.getElementById("screen-scoreboard").classList.add("active");});
  replayScore?.addEventListener("click", ()=> window.resetGame && window.resetGame());
  clearBtn?.addEventListener("click", ()=> { if(confirm("Effacer scores locaux ?")){ localStorage.removeItem("eg_scores_v1"); alert("Scores effacés"); } });

  loadScores();
  renderScoreboardTo("scoreboard-list");
});
