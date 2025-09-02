// js/intro.js - set of intro strings and helper
import { dlog } from "./debug.js";

const INTROS = [
  "Dans un grimoire poussiéreux, une prophétie renaît de l’oubli...",
  "Le roi te confie une mission périlleuse: rallumer la Flamme Primordiale.",
  "Une brise glacée murmure : « le temps est compté... »",
  "Les pages s’animent et montrent un chemin hors des ténèbres."
];

export function getRandomIntro(){
  const t = INTROS[Math.floor(Math.random()*INTROS.length)];
  dlog("Intro choisie:", t);
  return t;
}
