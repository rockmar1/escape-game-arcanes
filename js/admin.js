import { triggerVictory, triggerDefeat, GameState, unlockZone } from "./state.js";
import { showScreen } from "./router.js";

// Mot de passe hashé SHA-256 de "magie2025"
const ADMIN_HASH = "73f4e6aa83d143e69a8059d0f04b6d9a83e8e0e6c6a0c7b40b1f96a4ee9b0a12";

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
}

document.getElementById("toggle-admin").addEventListener("click", () =>
  document.getElementById("admin-tools").classList.toggle("hidden")
);

document.getElementById("admin-login").addEventListener("click", async () => {
  const input = document.getElementById("admin-pass").value;
  const hash = await sha256(input);
  if (hash === ADMIN_HASH) {
    document.getElementById("admin-actions").classList.remove("hidden");
  } else alert("Mot de passe incorrect");
});

document.getElementById("force-victory").addEventListener("click", () => triggerVictory("Victoire forcée"));
document.getElementById("force-defeat").addEventListener("click", () => triggerDefeat("Défaite forcée"));
document.getElementById("reset-score").addEventListener("click", () => {
  GameState.player.score = 0;
  document.getElementById("score-display").textContent = 0;
});
document.getElementById("skip-intro").addEventListener("click", () => showScreen("screen-game"));
document.getElementById("clear-scores").addEventListener("click", () => localStorage.removeItem("scores"));
document.getElementById("add-time").addEventListener("click", () => {
  GameState.timer += 60;
  document.getElementById("timer-display").textContent = GameState.timer;
});
document.getElementById("unlock-all").addEventListener("click", () => {
  unlockZone("zone-bibliotheque");
  unlockZone("zone-labo");
  unlockZone("zone-observatoire");
});
