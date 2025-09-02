// js/main.js - boots everything and wires UI
import { dlog } from "./debug.js";
import { initAdminPanel } from "./admin.js";
import { initRouter, goToIntro, startAdventure } from "./router.js"; // note: router exports functions
import { initAudioOnUserGesture } from "./audio.js";
import { renderScoreboardTo, loadScores, clearScores } from "./scoreboard.js";

// Initialize
document.addEventListener("DOMContentLoaded", ()=>{
  dlog("App DOMContentLoaded");

  // init admin button
  initAdminPanel();

  // init router
  initRouter();

  // bind UI
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
  const debugToggle = document.getElementById("debug-toggle");

  // first user gesture audio prime
  document.body.addEventListener("click", ()=> initAudioOnUserGesture(), { once: true });

  // start button
  startBtn?.addEventListener("click", ()=>{
    const name = pseudoInput.value.trim() || "Aventurier";
    // set name with router helper (router exported sets window.setPlayerName? we use global state setter defined in state.js)
    try { const { setPlayerName } = awaitImportState(); setPlayerName(name); } catch(e){ console.debug("state import fallback", e); }
    document.getElementById("hud-player").textContent = `👤 ${name}`;
    goToIntro();
  });

  // begin game after reading intro
  beginBtn?.addEventListener("click", ()=> {
    startAdventure();
  });

  skipIntro?.addEventListener("click", ()=> { startAdventure(); });

  // scoreboard controls
  gotoScore?.addEventListener("click", ()=> { renderScoreboardTo("scoreboard-list"); document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active")); document.getElementById("screen-scoreboard").classList.add("active"); });
  gotoScoreD?.addEventListener("click", ()=> { renderScoreboardTo("scoreboard-list"); document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active")); document.getElementById("screen-scoreboard").classList.add("active"); });
  replayV?.addEventListener("click", ()=> { window.resetGame && window.resetGame(); });
  replayD?.addEventListener("click", ()=> { window.resetGame && window.resetGame(); });
  replayScore?.addEventListener("click", ()=> { window.resetGame && window.resetGame(); });
  clearBtn?.addEventListener("click", ()=> { if(confirm("Effacer scores locaux ?")) { localStorage.removeItem("eg_scores_v1"); alert("Scores effacés"); }});

  debugToggle?.addEventListener("click", ()=>{
    const panel = document.getElementById("debug-panel");
    panel.classList.toggle("hidden");
  });

  // initial scoreboard render
  loadScores();
  renderScoreboardTo("scoreboard-list");
});

// helper to dynamic import state.js (avoid circular import in top-level)
function awaitImportState(){
  return import("./state.js");
}
