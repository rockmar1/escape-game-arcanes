// plume.js
import { dlog, dwarn } from "./debug.js";

export async function initPlumeAnimations() {
  const container = document.querySelector(".plume-text");
  if (!container) {
    dwarn("Aucune plume text container");
    return;
  }

  const text = container.dataset.text;
  container.textContent = "";
  for (let i=0; i<text.length; i++) {
    container.textContent += text[i];
    await new Promise(r => setTimeout(r, 50));
    playQuillSfx();
  }
  dlog("Intro terminée (effet plume fini)");
}

function playQuillSfx() {
  const audio = new Audio("assets/audio/sfx-quill.mp3");
  audio.play().catch(()=>{});
}
