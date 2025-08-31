// router.js
import { resetState } from "./state.js";
import { stopAllAudio, playAudio } from "./audio.js";

/**
 * Navigation entre écrans
 */
export function navigateTo(screenId) {
    console.debug("[DEBUG] Navigation vers :", screenId);
    document.querySelectorAll(".screen").forEach(el => el.classList.add("hidden"));
    const target = document.getElementById(screenId);
    if (target) target.classList.remove("hidden");
}

/**
 * Démarrage du jeu
 */
export function startGame() {
    resetState();
    playAudio("ambiance", { loop: true, volume: 0.4 });
    navigateTo("screen-game");
}

/**
 * Fin du jeu (victoire ou défaite)
 */
export function endGame(victory = false, message = "") {
    stopAllAudio();
    if (victory) {
        playAudio("victoire");
        navigateTo("screen-victory");
        document.querySelector("#victory-message").textContent = message || "Victoire !";
    } else {
        playAudio("defaite");
        navigateTo("screen-defeat");
        document.querySelector("#defeat-message").textContent = message || "Défaite...";
    }
}
