import { goToScreen } from "./router.js";
import { logDebug } from "./debug.js";

document.addEventListener("DOMContentLoaded", () => {
  logDebug("🚀 Main init");

  const pseudoBtn = document.getElementById("pseudo-btn");
  const pseudoInput = document.getElementById("pseudo-input");

  pseudoBtn.addEventListener("click", () => {
    const pseudo = pseudoInput.value.trim();
    if (!pseudo) return alert("Entrez un pseudo !");
    document.getElementById("player-pseudo").textContent = pseudo;
    goToScreen("intro");
  });

  document.getElementById("skip-intro").addEventListener("click", () => {
    goToScreen("game");
  });

  goToScreen("pseudo");
});
