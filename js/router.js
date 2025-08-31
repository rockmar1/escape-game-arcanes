// router.js
import { showScreen } from "./ui.js";
import { resetGame, gameState, setPlayerName } from "./state.js";
import { autoSaveResult, loadScoreboard } from "./scoreboard.js";

document.addEventListener("DOMContentLoaded", () => {
    const btnStart = document.getElementById("btn-start");
    if (btnStart) {
        btnStart.addEventListener("click", () => {
            const name = document.getElementById("player-name").value.trim();
            if (name.length > 0) {
                setPlayerName(name);
                startGame();
            }
        });
    }

    document.getElementById("btn-menu1")?.addEventListener("click", backToMenu);
    document.getElementById("btn-menu2")?.addEventListener("click", backToMenu);
    document.getElementById("btn-menu3")?.addEventListener("click", backToMenu);

    // Charger le scoreboard au lancement
    loadScoreboard();
});

export function startGame() {
    resetGame();
    showScreen("screen-game");
    console.debug("[DEBUG] Jeu démarré pour :", gameState.player);

    // Exemple de timer
    let interval = setInterval(() => {
        gameState.timeLeft--;
        document.getElementById("timer").textContent = gameState.timeLeft;

        if (gameState.timeLeft <= 0) {
            clearInterval(interval);
            endGame(false, "Temps écoulé !");
        }
    }, 1000);
}

export function endGame(victory, message = "") {
    console.debug("[DEBUG] Fin de partie :", victory ? "Victoire" : "Défaite");

    // Sauvegarde auto du score
    autoSaveResult(victory);

    if (victory) {
        document.getElementById("victory-message").textContent = message || "Bravo !";
        showScreen("screen-victory");
    } else {
        document.getElementById("defeat-message").textContent = message || "Dommage...";
        showScreen("screen-defeat");
    }
}

export function backToMenu() {
    showScreen("screen-intro");
}
