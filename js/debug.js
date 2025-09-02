// js/debug.js
// Provides debug logging to UI panel and console.
// Use dlog/dwarn/derr everywhere.

export function dlog(...args){
  const msg = args.map(a => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ");
  _append("[DBG] " + msg);
  console.log("[DBG]", ...args);
}
export function dwarn(...args){
  const msg = args.join(" ");
  _append("[WARN] " + msg);
  console.warn("[WARN]", ...args);
}
export function derr(...args){
  const msg = args.join(" ");
  _append("[ERR] " + msg);
  console.error("[ERR]", ...args);
}

function _append(text){
  try {
    const panel = document.getElementById("debug-panel");
    const log = document.getElementById("debug-log");
    if (!panel || !log) return;
    const line = document.createElement("div");
    line.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
    log.appendChild(line);
    log.scrollTop = log.scrollHeight;
    // show panel in compact mode (the button toggles)
    panel.classList.remove("hidden");
  } catch(e) { /* ignore UI logging errors */ }
}
