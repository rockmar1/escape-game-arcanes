import { endGame } from "./router.js";
import { resetScoreboard } from "./scoreboard.js";
import { debugLog } from "./state.js";

// ==========================
// Mot de passe admin (hashé)
// ==========================
// Mot de passe clair = "magie123" (par exemple)
const ADMIN_PASSWORD_HASH =
  "0b86b9c6df5dbf9c38c2a3a22153f6b86e2456e5b9e84a41a6c72e5e6ad37e63"; 
// (SHA-256 de "magie123")

// Fonction de hash SHA-256
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

// ==========================
// Gestion du Panel Admin
// ==========================
const toggleBtn = document.getElementById("admin-toggle");
const adminPanel = document.getElementById("admin-panel");
const loginBtn = document.getElementById("admin-login");
const passwordInput = document.getElementById("admin-password");
const toolsDiv = document.getElementById("admin-tools");

toggleBtn.addEventListener("click", () => {
  adminPanel.classList.toggle("hidden");
});

// Login admin
loginBtn.addEventListener("click", async () => {
  const entered = passwordInput.value;
  const hash = await hashPassword(entered);

  if (hash === ADMIN_PASSWORD_HASH) {
    debugLog("✅ Connexion admin réussie");
    toolsDiv.classList.remove("hidden");
  } else {
    debugLog("❌ Mot de passe incorrect");
    alert("Mot de passe incorrect !");
  }
});

// ==========================
// Outils Admin
// ==========================
document.getElementById("force-victory").addEventListener("click", () => {
  debugLog("⚡ Forçage Victoire");
  endGame("victory");
});

document.getElementById("force-defeat").addEventListener("click", () => {
  debugLog("⚡ Forçage Défaite");
  endGame("defeat");
});

document.getElementById("reset-scoreboard").addEventListener("click", () => {
  debugLog("🗑 Réinitialisation scores");
  resetScoreboard();
});

// Debug Mode
const debugCheckbox = document.getElementById("debug-mode");
const debugOutput = document.getElementById("debug-log");

export function adminDebug(message) {
  console.log("[ADMIN DEBUG]", message);
  if (debugCheckbox && debugCheckbox.checked && debugOutput) {
    debugOutput.textContent += `[ADMIN DEBUG] ${message}\n`;
  }
}
