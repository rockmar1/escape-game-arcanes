// admin.js
import { endGame } from "./router.js";
import { resetState } from "./state.js";
import { clearScoreboard } from "./scoreboard.js";

// Sécurité : mot de passe hashé (SHA-256 de "admin123")
const ADMIN_HASH = "6c4e2071673ffb391d4bdf6eb9c7cdbaff342a2e59954e07de3f1cdd192d08da";

async function hashPassword(password) {
    const msgUint8 = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

document.getElementById("admin-login-btn").addEventListener("click", async () => {
    const input = document.getElementById("admin-password").value;
    const hash = await hashPassword(input);

    if (hash === ADMIN_HASH) {
        document.getElementById("admin-panel").classList.remove("hidden");
        console.debug("[DEBUG] Connexion admin réussie");
    } else {
        alert("Mot de passe incorrect !");
    }
});

// Boutons du panel admin
document.getElementById("force-victory").addEventListener("click", () => {
    endGame(true, "Victoire forcée via admin panel.");
});
document.getElementById("force-defeat").addEventListener("click", () => {
    endGame(false, "Défaite forcée via admin panel.");
});
document.getElementById("reset-scores").addEventListener("click", () => {
    clearScoreboard();
    alert("Scores effacés !");
});
document.getElementById("reset-game").addEventListener("click", () => {
    resetState();
    alert("Jeu réinitialisé !");
});
