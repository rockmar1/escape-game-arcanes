import { goToScreen, startAdventure } from "./router.js";
import { log } from "./debug.js";
import { playSfx } from "./audio.js";
import { plumeWrite } from "./plume.js";

const intros = [
  "Dans un grimoire poussiéreux, une prophétie renaît de l’oubli...",
  "Les flammes des bougies vacillent, un secret s’apprête à être révélé...",
  "Dans l’ombre du château, une force oubliée s’éveille...",
  "Les runes anciennes se consument lentement, révélant votre destinée...",
  "Un murmure traverse les couloirs obscurs : 'Le gardien doit s’éveiller...'"
];

export function playIntro() {
  goToScreen("intro");

  const chosen = intros[Math.floor(Math.random() * intros.length)];
  log("Intro chosen " + chosen);
  playSfx("quill");

  const el = document.getElementById("intro-text");
  if (!el) {
    log("⚠️ intro-text introuvable !");
    return;
  }

  // Effet plume → une fois fini on passe au jeu
  plumeWrite(el, chosen, () => {
    log("plume finished");
    setTimeout(() => {
      log("Intro terminée → lancement de l’aventure");
      startAdventure(); // <-- ici on part dans les puzzles
    }, 1500);
  });
}
