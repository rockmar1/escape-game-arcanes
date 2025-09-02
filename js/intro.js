import { debugLog } from "./debug.js";

// Liste des intros aléatoires
const intros = [
  "Une prophétie oubliée surgit des flammes d’un vieux grimoire...",
  "Le roi vous confie une mission périlleuse, sauvez le royaume !",
  "Dans vos rêves, une vision mystérieuse apparaît, annonçant l’apocalypse...",
  "Les esprits anciens murmurent à votre oreille : le temps est compté..."
];

// Fonction pour choisir une intro au hasard
export function getRandomIntro() {
  const index = Math.floor(Math.random() * intros.length);
  debugLog("Intro choisie : " + intros[index]);
  return intros[index];
}
