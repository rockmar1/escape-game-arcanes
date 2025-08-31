import { GameState } from "./state.js";
import { showScreen } from "./router.js";
import { initPuzzles } from "./puzzles/index.js";
import { initAudioOnUserGesture } from "./audio.js";
import { unlockZone } from "./state.js";

GameState.timer = 600;
document.getElementById("start-btn").addEventListener("click", ()=>{
  const name = document.getElementById("player-name").value.trim();
  if(!name) return alert("Entre ton pseudo");
  GameState.player.name = name;
  document.getElementById("player-display").textContent = `Joueur : ${name}`;
  document.getElementById("intro-story").textContent = `Écoute, ${name}... Le royaume attend.`;
  showScreen("screen-intro");
});

// begin game -> user gesture: init audio + unlock first zone + init puzzles
document.getElementById("begin-game").addEventListener("click", ()=>{
  initAudioOnUserGesture(); // ensure audio started after user click
  unlockZone("zone-bibliotheque");
  initPuzzles();
  GameState.timer = 600;
  document.getElementById("timer-display").textContent = GameState.timer;
  showScreen("screen-game");
  // start timer loop
  const interval = setInterval(()=>{
    if(GameState.victory || GameState.defeat) return clearInterval(interval);
    GameState.timer--;
    document.getElementById("timer-display").textContent = GameState.timer;
    if(GameState.timer <= 0){ GameState.defeat = true; document.getElementById("defeat-story").textContent = "Temps écoulé"; showScreen("screen-defeat"); clearInterval(interval); }
    // speed up ambience near end would be managed in audio module
  },1000);
});
