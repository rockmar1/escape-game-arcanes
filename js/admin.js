import { endGame, backToMenu, skipCurrentPuzzle, addTime } from "./router.js";
import { clearScoreboard, showSolutions } from "./scoreboard.js";

// Hash du mot de passe "admin123"
const ADMIN_HASH = "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9";

function hashString(str) {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(str))
        .then(buf => {
            return Array.from(new Uint8Array(buf))
                .map(b => b.toString(16).padStart(2, "0"))
                .join("");
        });
}

// Création panneau flottant
const adminPanel = document.createElement("div");
adminPanel.id = "admin-panel";
adminPanel.innerHTML = `
    <button id="toggle-admin">⚙️ Admin</button>
    <div id="admin-menu" class="hidden">
        <input type="password" id="admin-password" placeholder="Mot de passe">
        <button id="btn-login">Se connecter</button>
        <div id="admin-tools" class="hidden">
            <h3>Outils Admin</h3>
            <button id="btn-force-victory">Forcer Victoire</button>
            <button id="btn-force-defeat">Forcer Défaite</button>
            <button id="btn-reset-scores">Réinitialiser Scores</button>
            <button id="btn-back-menu">Retour Menu</button>
            <hr>
            <button id="btn-skip">⏭️ Sauter énigme</button>
            <button id="btn-add-time">⏱️ +60s</button>
            <button id="btn-solutions">📜 Voir Solutions</button>
        </div>
    </div>
`;
document.body.appendChild(adminPanel);

// Toggle ouverture menu
document.getElementById("toggle-admin").addEventListener("click", () => {
    document.getElementById("admin-menu").classList.toggle("hidden");
});

// Login Admin
document.getElementById("btn-login").addEventListener("click", async () => {
    const input = document.getElementById("admin-password").value.trim();
    const hashed = await hashString(input);

    if (hashed === ADMIN_HASH) {
        document.getElementById("admin-tools").classList.remove("hidden");
        alert("✅ Accès Admin autorisé !");
    } else {
        alert("❌ Mot de passe incorrect");
    }
});

// Actions admin
document.getElementById("btn-force-victory").addEventListener("click", () => {
    endGame(true, "Victoire forcée par Admin");
});

document.getElementById("btn-force-defeat").addEventListener("click", () => {
    endGame(false, "Défaite forcée par Admin");
});

document.getElementById("btn-reset-scores").addEventListener("click", () => {
    if (confirm("Effacer tout le scoreboard ?")) clearScoreboard();
});

document.getElementById("btn-back-menu").addEventListener("click", () => {
    backToMenu();
});

document.getElementById("btn-skip").addEventListener("click", () => {
    skipCurrentPuzzle();
});

document.getElementById("btn-add-time").addEventListener("click", () => {
    addTime(60);
});

document.getElementById("btn-solutions").addEventListener("click", () => {
    showSolutions();
});
