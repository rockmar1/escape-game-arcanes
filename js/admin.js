import { GameState } from "./state.js";
import { getSolutions } from "./puzzleRegistry.js";
import { showScreen } from "./router.js";
import { unlockZone } from "./state.js";

const ADMIN_HASH = "73f4e6aa83d143e69a8059d0f04b6d9a83e8e0e6c6a0c7b40b1f96a4ee9b0a12"; // SHA-256("magie2025")

async function sha256(message){
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  return Array.from(new Uint8Array(hashBuffer)).map(b=>b.toString(16).padStart(2,"0")).join("");
}

document.getElementById("toggle-admin").addEventListener("click", ()=> document.getElementById("admin-tools").classList.toggle("hidden"));
document.getElementById("admin-login").addEventListener("click", async ()=>{
  const v = document.getElementById("admin-pass").value;
  const h = await sha256(v);
  if(h === ADMIN_HASH){
    document.getElementById("admin-actions").classList.remove("hidden");
    // populate solutions
    const sol = getSolutions();
    const ul = document.getElementById("solutions-list"); ul.innerHTML="";
    Object.entries(sol).forEach(([k,v])=>{ const li = document.createElement("li"); li.textContent = `${k} → ${v}`; ul.appendChild(li); });
  } else alert("Mot de passe incorrect");
});

document.getElementById("force-victory").addEventListener("click", ()=> { GameState.victory = true; document.getElementById("victory-story").textContent = "Victoire admin"; showScreen("screen-victory"); });
document.getElementById("force-defeat").addEventListener("click", ()=> { GameState.defeat = true; document.getElementById("defeat-story").textContent = "Défaite admin"; showScreen("screen-defeat"); });
document.getElementById("reset-score").addEventListener("click", ()=> { GameState.player.score = 0; document.getElementById("score-display").textContent = 0; localStorage.removeItem("scores"); });
document.getElementById("skip-intro").addEventListener("click", ()=> showScreen("screen-game"));
document.getElementById("clear-scores").addEventListener("click", ()=> localStorage.removeItem("scores"));
document.getElementById("add-time").addEventListener("click", ()=> { GameState.timer += 60; document.getElementById("timer-display").textContent = GameState.timer; });
document.getElementById("unlock-all").addEventListener("click", ()=> { unlockZone("zone-bibliotheque"); unlockZone("zone-labo"); unlockZone("zone-observatoire"); });
