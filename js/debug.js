export function logDebug(message) {
  const panel = document.getElementById("debug-panel");
  const log = document.getElementById("debug-log");
  if (!panel || !log) return;

  const entry = document.createElement("div");
  entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight;

  panel.classList.remove("hidden");
}
