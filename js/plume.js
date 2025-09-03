// plume.js
import { dlog, dwarn } from "./debug.js";
import { playSfx } from "./audio.js";

/**
 * Anime un texte avec effet plume et joue le son pour chaque lettre.
 * @param {HTMLElement} container - L'élément contenant le texte
 * @param {string} text - Le texte à afficher
 * @param {number} delay - délai entre chaque lettre (ms)
 * @param {function} onComplete - callback quand fini
 */
export function animatePlumeText(container, text, delay = 60, onComplete = null) {
  if (!container) {
    dwarn("Container plume non trouvé");
    if (onComplete) onComplete();
    return;
  }
  container.textContent = ""; // reset
  let index = 0;

  function typeLetter() {
    if (index < text.length) {
      container.textContent += text[index];
      // jouer son plume uniquement sur les caractères visibles
      if (text[index].match(/\S/)) {
        try { playSfx("quill"); } catch (e) { dwarn("Erreur playSfx plume:", e); }
      }
      index++;
      setTimeout(typeLetter, delay);
    } else {
      dlog("Plume animation terminée");
      if (onComplete) onComplete();
    }
  }

  typeLetter();
}

/**
 * Initialise tous les conteneurs .plume-text automatiquement
 * Chaque conteneur doit avoir data-text="..." avec le texte à animer
 */
export function initPlumeAnimations() {
  const containers = document.querySelectorAll(".plume-text");
  containers.forEach(container => {
    const text = container.dataset.text || container.textContent;
    animatePlumeText(container, text);
  });
}
