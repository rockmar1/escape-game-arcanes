// debug.js
export function dlog(msg) {
    console.log("[DBG]", msg);
    const log = document.getElementById("debug-log");
    if(log) { log.textContent += "[DBG] " + msg + "\n"; log.scrollTop = log.scrollHeight; }
}

export function derr(msg, err) {
    console.error("[ERR]", msg, err || "");
    const log = document.getElementById("debug-log");
    if(log) { log.textContent += "[ERR] " + msg + " " + (err || "") + "\n"; log.scrollTop = log.scrollHeight; }
}

export function dwarn(msg) {
    console.warn("[WARN]", msg);
    const log = document.getElementById("debug-log");
    if(log) { log.textContent += "[WARN] " + msg + "\n"; log.scrollTop = log.scrollHeight; }
}
