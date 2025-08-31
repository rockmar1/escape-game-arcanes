import { navigateTo } from "./router.js";
import { setPlayerName, getPlayerName, resetState } from "./state.js";
import { playAudio, stopAllAudio } from "./audio.js";

// On récupère le bouton
const startBtn = document.getElementById("btn-start");
const playerInput = document.getElementById("playerName");

// Ajout d’un écouteur sur le bouton
if (startBtn) {
  startBtn.addEventListener("click", () => {
    console.log("[DEBUG] Bouton Commencer cliqué"); // ✅ Vérif bouton

    const name = playerInput.value.trim();
    if (!name) {
      alert("Veuillez entrer un pseudo !");
      return;
    }

    setPlayerName(name);
    console.log("[DEBUG] Pseudo défini :", getPlayerName());

    resetState();

    // Musique intro -> ambiance
    stopAllAudio();
    playAudio("intro");

    // On passe à l’écran intro
    navigateTo("intro");
  });
} else {
  console.error("[ERREUR] Impossible de trouver le bouton #btn-start");
}
