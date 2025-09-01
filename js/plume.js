/**
 * Animation plume style écriture
 * @param {HTMLElement} container
 * @param {string} text
 * @param {object} options
 */
export function animatePlume(container, text, options = {}) {
  const { speed = 40, caret = true } = options;
  container.innerHTML = "";

  return new Promise((resolve) => {
    let i = 0;
    const caretEl = document.createElement("span");
    caretEl.classList.add("caret");
    if (caret) container.appendChild(caretEl);

    function typeNext() {
      if (i < text.length) {
        caretEl.insertAdjacentText("beforebegin", text[i]);
        i++;
        setTimeout(typeNext, speed);
      } else {
        caretEl.remove();
        resolve();
      }
    }
    typeNext();
  });
}
