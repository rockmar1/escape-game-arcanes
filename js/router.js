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
      const intros = [
        `Dans un royaume oublié...
Un pouvoir ancien sommeille.`,
        `La magie des Arcanes
n'attend que ton courage.`,
        `Les ombres s'étendent...
Mais un héros peut encore briller.`,
      ];
      const text = intros[Math.floor(Math.random() * intros.length)];
      animatePlume(introEl, text, { speed: 35, caret: true }).then(() => {
        document.getElementById("hud").classList.remove("hidden");
        goToScreen("game");
      });
    }
  }

  if (screenName === "victory") {
    const v = screen.querySelector(".victory-container");
    if (v) {
      const victories = [
        "Félicitations !\nTu as sauvé le royaume des ténèbres.",
        "Ton courage a dissipé la malédiction.",
        "La lumière renaît grâce à toi, aventurier."
      ];
      animatePlume(v, victories[Math.floor(Math.random() * victories.length)]);
    }
  }

  if (screenName === "defeat") {
    const d = screen.querySelector(".defeat-container");
    if (d) {
      const defeats = [
        "Hélas... le royaume est tombé.",
        "Les arcanes t'ont échappé.",
        "La nuit éternelle s'est abattue..."
      ];
      animatePlume(d, defeats[Math.floor(Math.random() * defeats.length)]);
    }
  }
}

export function initRouter() {
  goToScreen("pseudo");
}
