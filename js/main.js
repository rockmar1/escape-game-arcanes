// main.js
import { startGame, endGame } from "./router.js";
import { setPlayerName } from "./state.js";
import { resetScoreboard } from "./scoreboard.js";

document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("btn-start");
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      const name = document.getElementById("playerName").value.trim();
      if (!name) {
        alert("Veuillez entrer un pseudo !");
        return;
      }
      setPlayerName(name);
      startGame();
    });
  }

  const replay1 = document.getElementById("btn-replay");
  if (replay1) replay1.onclick = () => location.reload();

  const replay2 = document.getElementById("btn-replay2");
  if (replay2) replay2.onclick = () => location.reload();
});

// expose admin tools globally
window.endGame = endGame;
window.resetScoreboard = resetScoreboard;
window.skipCurrentPuzzle = () => {
  if (window.currentPuzzleUnmount) {
    window.currentPuzzleUnmount();
    document.getElementById("puzzle-container").innerHTML = "<p>Énigme sautée par admin.</p>";
  }
};
window.toggleDebug = () => {
  const log = document.getElementById("debug-log");
  if (log.style.display === "block") {
    log.style.display = "none";
  } else {
    log.style.display = "block";
    log.textContent += "\n[DEBUG] Debug activé";
  }
};
