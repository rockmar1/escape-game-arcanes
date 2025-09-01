import { playMusic, stopAllMusic } from "./audio.js";
import { animatePlume } from "./plume.js";

export function goToScreen(screenName) {
  console.log("[DBG] goToScreen ->", screenName);

  // cacher tous les écrans
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const screen = document.getElementById("screen-" + screenName);
  if (screen) screen.classList.add("active");

  stopAllMusic();
  playMusic(screenName);

  if (screenName === "intro") {
    const introEl = screen.querySelector(".intro-container");
    if (introEl) {
      const text = `Dans un royaume oublié...
Une aventure t’attend, ${localStorage.getItem("playerName") || "Héros"} !`;
      animatePlume(introEl, text, { speed: 35, caret: true }).then(() => {
        document.getElementById("hud").classList.add("visible");
        goToScreen("game");
      });
    }
  }

  if (screenName === "victory") {
    const v = screen.querySelector(".victory-container");
    if (v) {
      const text = "Félicitations !\nTu as sauvé le royaume.";
      animatePlume(v, text, { speed: 30 });
    }
  }

  if (screenName === "defeat") {
    const d = screen.querySelector(".defeat-container");
    if (d) {
      const text = "Hélas... le royaume est tombé.\nMais tu pourras réessayer.";
      animatePlume(d, text, { speed: 30 });
    }
  }
}