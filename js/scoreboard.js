// scoreboard.js
import { gameState } from "./state.js";

const STORAGE_KEY = "escapeGameScores";

export function autoSaveResult(victory) {
    const scores = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    scores.push({
        player: gameState.player,
        score: gameState.score,
        victory,
        date: new Date().toLocaleString()
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
    console.debug("[DEBUG] Score sauvegardé :", scores[scores.length - 1]);
    loadScoreboard();
}

export function loadScoreboard() {
    const scores = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const list = document.getElementById("score-list");
    if (list) {
        list.innerHTML = "";
        scores.forEach(s => {
            const li = document.createElement("li");
            li.textContent = `${s.player} - ${s.victory ? "Victoire" : "Défaite"} - Score: ${s.score} - ${s.date}`;
            list.appendChild(li);
        });
    }
}

export function clearScoreboard() {
    localStorage.removeItem(STORAGE_KEY);
    loadScoreboard();
    console.debug("[DEBUG] Scoreboard réinitialisé");
}
