import { logDebug } from "./debug.js";

let scores = [];

export function saveScore(result) {
  const pseudo = document.getElementById("player-pseudo").textContent || "Anonyme";
  const time = document.getElementById("timer").textContent || "0:00";
  const entry = { pseudo, result, time, date: new Date().toLocaleString() };
  scores.push(entry);
  logDebug("💾 Score sauvegardé : " + JSON.stringify(entry));
}

export function showScoreboard() {
  const list = document.getElementById("scoreboard-list");
  list.innerHTML = "";
  scores.forEach(s => {
    const li = document.createElement("li");
    li.textContent = `${s.pseudo} - ${s.result.toUpperCase()} - ${s.time} (${s.date})`;
    list.appendChild(li);
  });

  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById("screen-scoreboard").classList.add("active");
}
