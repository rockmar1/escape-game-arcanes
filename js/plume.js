/**
 * plume.js
 * Petit module pour afficher un texte "plume" (lettre par lettre).
 *
 * Exports:
 *  - animatePlume(container, text, opts) -> returns a Promise resolved when done
 *  - animatePlumeSync(container, text, opts, onChar) -> starts and returns an object with `cancel()` if needed
 *
 * Usage example:
 *   import { animatePlume } from './plume.js';
 *   await animatePlume(document.getElementById('introText'), "Bonjour...", { speed: 35, caret: true });
 */

export function animatePlume(container, text, opts = {}) {
  return new Promise((resolve) => {
    const runner = animatePlumeSync(container, text, opts, null);
    runner.onDone = resolve;
  });
}

export function animatePlumeSync(container, text, opts = {}, onChar) {
  // opts:
  //  - speed: milliseconds per character (default 35)
  //  - caret: boolean show a small caret at end (default false)
  //  - preserveNewlines: true to keep newlines (default true)
  //  - skipIfSame: if container already has same text, skip (default false)
  const speed = typeof opts.speed === "number" ? opts.speed : 35;
  const caret = !!opts.caret;
  const preserveNewlines = opts.preserveNewlines !== false;
  const skipIfSame = !!opts.skipIfSame;

  // normalize
  if (!container) throw new Error("container is required");

  const plain = String(text === null || text === undefined ? "" : text);

  if (skipIfSame && container.dataset._plume_text === plain) {
    // immediate resolve behaviour
    const fake = { cancel(){}, onDone: null };
    setTimeout(()=> fake.onDone && fake.onDone(), 0);
    return fake;
  }

  container.dataset._plume_text = plain;
  container.innerHTML = "";
  container.classList.remove("plume-active");

  // ensure newlines are preserved in rendering
  container.style.whiteSpace = "pre-wrap";

  // create caret if requested
  let caretEl = null;
  if (caret) {
    caretEl = document.createElement("span");
    caretEl.className = "plume-caret";
    // do not append yet, it will be appended after first char to look natural
  }

  const chars = Array.from(plain);
  let cancelled = false;
  let idx = 0;

  function revealChar(i) {
    if (cancelled) return;
    const ch = chars[i];
    const span = document.createElement("span");
    span.className = "plume-char";
    // keep whitespace and newline behavior
    span.textContent = ch;
    container.appendChild(span);

    // small timeout to allow layout then reveal with CSS transition
    requestAnimationFrame(() => {
      // create a tiny stagger using setTimeout to avoid blocking
      setTimeout(() => {
        span.classList.add("visible");
        onChar && onChar(i, span, ch);
        // move caret after this char if caret present
        if (caretEl) {
          if (!caretEl.parentNode) container.appendChild(caretEl);
        }
      }, 8);
    });

    idx++;
  }

  let loopTimer = null;

  function loop() {
    if (cancelled) return;
    if (idx < chars.length) {
      revealChar(idx);
      loopTimer = setTimeout(loop, speed);
    } else {
      // finished
      if (caretEl && caretEl.parentNode) {
        // keep caret for a short while, then remove
        setTimeout(() => { if (caretEl && caretEl.parentNode) caretEl.remove(); }, 700);
      }
      if (runner.onDone) runner.onDone();
    }
  }

  // start
  const runner = {
    cancel() {
      cancelled = true;
      if (loopTimer) clearTimeout(loopTimer);
    },
    onDone: null
  };

  // small initial delay so the user perceives the "plume"
  setTimeout(loop, Math.max(0, (opts.delay||0)));

  return runner;
}