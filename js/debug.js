// Petit utilitaire de debug : affiche dans console ET #debug-log si présent.
export let VERBOSE = true;

export function setVerbose(v) {
  VERBOSE = !!v;
}

/** debug log (info) */
export function dlog(...args) {
  if (!VERBOSE) return;
  console.log("[DBG]", ...args);
  const panel = document.getElementById("debug-log");
  if (panel) {
    try {
      panel.textContent += "[DBG] " + args.map(a => String(a)).join(" ") + "\n";
      panel.scrollTop = panel.scrollHeight;
    } catch (e) { /* ignore */ }
  }
}

/** warning */
export function dwarn(...args) {
  console.warn("[WARN]", ...args);
  const panel = document.getElementById("debug-log");
  if (panel) {
    try {
      panel.textContent += "[WARN] " + args.map(a => String(a)).join(" ") + "\n";
      panel.scrollTop = panel.scrollHeight;
    } catch (e) { /* ignore */ }
  }
}

/** error */
export function derr(...args) {
  console.error("[ERR]", ...args);
  const panel = document.getElementById("debug-log");
  if (panel) {
    try {
      panel.textContent += "[ERR] " + args.map(a => String(a)).join(" ") + "\n";
      panel.scrollTop = panel.scrollHeight;
    } catch (e) { /* ignore */ }
  }
}
