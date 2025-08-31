// ===============================
// admin.js — Panel admin sécurisé + outils
// ===============================

// Mot de passe admin : "Magus2025"
const ADMIN_SHA256 = "0241c0a54e621b3b05787d107ee864600d11cfa0c370d2dda71c7625089b139e";

async function sha256(text) {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2,"0")).join("");
}

// Afficher l’écran admin avec Ctrl+M
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key.toLowerCase() === "m") {
    showScreen("screen-admin");
  }
});

const adminLoginBtn = document.getElementById("admin-login");
const adminPassInput = document.getElementById("admin-pass");
const adminTools = document.getElementById("admin-tools");

if (adminLoginBtn) {
  adminLoginBtn.addEventListener("click", async () => {
    const hash = await sha256(adminPassInput.value || "");
    if (hash === ADMIN_SHA256) {
      adminTools.classList.remove("hidden");
      alert("✅ Accès Admin accordé");
    } else {
      adminTools.classList.add("hidden");
      alert("❌ Mot de passe incorrect");
    }
  });
}

// Outils
const btnForceWin = document.getElementById("force-victory");
const btnForceLose = document.getElementById("force-defeat");
const btnReset = document.getElementById("reset-score");
const btnSkipIntro = document.getElementById("skip-intro");

btnForceWin?.addEventListener("click", () => {
  if (!confirm("Forcer la victoire ?")) return;
  triggerVictory(`Par décret des Arcanes, ${GameState.player.name}, la victoire est tienne.`);
});

btnForceLose?.addEventListener("click", () => {
  if (!confirm("Forcer la défaite ?")) return;
  triggerDefeat(`Les ombres s’abattent d’un geste du Conseil Souterrain…`);
});

btnReset?.addEventListener("click", () => {
  if (!confirm("Réinitialiser score & état ?")) return;
  GameState.player.score = 0;
  GameState.puzzles = { runes:false, potions:false, labyrinthe:false, etoiles:false };
  document.getElementById("score-display").textContent = 0;
  alert("État réinitialisé.");
});

btnSkipIntro?.addEventListener("click", () => {
  // saute directement au jeu (si pseudo déjà entré)
  if (!GameState.player.name) {
    alert("Entre un pseudo d’abord dans l’écran d’accueil.");
    return;
    }
  beginIntro();
});
