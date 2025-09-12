// plume.js
import { dlog, dwarn, derr } from "./debug.js";
import { playSfx } from "./audio.js";

export function initPlumeAnimations() {
  dlog("initPlumeAnimations called");

  const plumeContainers = document.querySelectorAll(".plume-text");
  plumeContainers.forEach(container => {
    const text = container.dataset.text || "";
    container.textContent = "";
    let i = 0;

    function writeChar() {
      if (i < text.length) {
        container.textContent += text[i];
        i++;
        playSfx("quill"); // joue le son plume si défini
        setTimeout(writeChar, 50);
      } else {
        dlog("plume finished");
      }
    }

    writeChar();
  });
}
