// intro.js
import { dlog } from "./debug.js";
import { playMusic, stopAllMusic } from "./audio.js";

export function playIntro(introIndex = 0) {
  dlog(`playIntro(${introIndex}) called`);

  stopAllMusic(); // stop toute musique précédente

  const intros = [
    "Dans un grimoire poussiéreux, une prophétie renaît de l’oubli...",
    "Les étoiles s’alignent et un destin inattendu s’éveille...",
    "Une brume magique enveloppe la vallée oubliée...",
  ];

  const introText = intros[introIndex % intros.length];
  const container = document.getElementById("intro-container");
  if (!container) {
    dlog("Intro container not found");
    return;
  }

  container.querySelector(".plume-text").dataset.text = introText;

  playMusic("intro");
}
