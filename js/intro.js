import { dlog } from "./debug.js";
import { playSfx } from "./audio.js";
import { goToScreen } from "./router.js";

// Textes d'intros multiples
const intros = [
  "Dans un grimoire poussiéreux, une prophétie renaît de l’oubli...",
  "Les flammes vacillantes révèlent des secrets gravés à l’encre magique...",
  "Sous la lueur des étoiles, les arcanes murmurent ton destin...",
  "Les cristaux résonnent, ouvrant le passage vers l’inconnu...",
  "Un souffle ancien t’appelle à relever les épreuves oubliées..."
];

let currentIntro = 0;

/**
 * Lance une intro avec effet plume
 */
export function startIntro(onFinish) {
  const text = intros[currentIntro % intros.length];
  currentIntro++;

  const container = document.getElementById("intro-text");
  if (!container) {
    dlog("[intro.js] Impossible de trouver #intro-text");
    onFinish?.();
    return;
  }

  container.innerHTML = "";
  dlog(`Intro chosen: ${text}`);

  // Effet plume : lettres qui s'écrivent une par une
  let i = 0;
  const interval = setInterval(() => {
    if (i < text.length) {
      container.innerHTML += text[i];
      playSfx("quill");
      i++;
    } else {
      clearInterval(interval);
      dlog("plume finished");
      setTimeout(() => {
        dlog("Intro terminée (effet plume fini)");
        onFinish?.();
      }, 1000);
    }
  }, 80);
}
