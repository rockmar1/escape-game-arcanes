export function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
  console.debug("[DEBUG] Écran affiché :", id);
}

export function updateHUD(player, score, time) {
  document.getElementById("hud-player").textContent = player;
  document.getElementById("hud-score").textContent = "Score: " + score;
  document.getElementById("hud-timer").textContent = "⏳ " + time + "s";
}
