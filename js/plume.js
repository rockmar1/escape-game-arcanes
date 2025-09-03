import { playSfx, dlog } from './audio.js';

export function initPlumeAnimations(callback) {
  const container = document.querySelector('.plume-text');
  const texts = [
    "Dans un grimoire poussiéreux, une prophétie renaît de l’oubli...",
    "Les arcanes anciennes murmurent à ceux qui savent écouter...",
    "Une plume danse sur le parchemin révélant des secrets oubliés..."
  ];
  const text = texts[Math.floor(Math.random() * texts.length)];
  container.dataset.text = text;
  container.textContent = '';

  let i = 0;
  const interval = setInterval(() => {
    container.textContent += text[i];
    playSfx('sfx_quill');
    i++;
    if (i >= text.length) {
      clearInterval(interval);
      dlog('plume finished');
      if (callback) callback();
    }
  }, 50);
}
