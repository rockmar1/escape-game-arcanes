// Utilitaires de debug ultra verbeux : console + #debug-log si présent
let VERBOSE = true; // tu peux mettre false pour ne voir que les erreurs

export function setDebug(on) { VERBOSE = !!on; }

function panel() {
  return document.getElementById("debug-log");
}

export function dlog(...args) {
  if (!VERBOSE) return;
  console.log("[DBG]", ...args);
  const p = panel();
  if (p) { p.textContent += "[DBG] " + args.map(a => String(a)).join(" ") + "\n"; p.scrollTop = p.scrollHeight; }
}

export function dwarn(...args) {
  console.warn("[WARN]", ...args);
  const p = panel();
  if (p) { p.textContent += "[WARN] " + args.map(a => String(a)).join(" ") + "\n"; p.scrollTop = p.scrollHeight; }
}

export function derr(...args) {
  console.error("[ERR]", ...args);
  const p = panel();
  if (p) { p.textContent += "[ERR] " + args.map(a => String(a)).join(" ") + "\n"; p.scrollTop = p.scrollHeight; }
}

export function dash(title) { dlog("——— " + title + " ———"); }

// Vérifie la présence d’un élément par id
export function assertEl(id, desc = "") {
  const el = document.getElementById(id);
  if (!el) {
    derr(`Élément manquant: #${id} ${desc ? "(" + desc + ")" : ""}`);
  } else {
    dlog(`OK #${id} ${desc ? "(" + desc + ")" : ""}`);
  }
  return el;
}

// Attache un listener click avec logs et try/catch
export function wireClick(id, handler) {
  const el = assertEl(id, "wireClick");
  if (!el) return false;
  el.addEventListener("click", (ev) => {
    dlog(`CLICK #${id}`);
    try {
      handler(ev);
      dlog(`Handler OK pour #${id}`);
    } catch (e) {
      derr(`Exception handler #${id}:`, e);
    }
  });
  dlog(`Listener attaché sur #${id}`);
  return true;
}

// Vérifie que tous les écrans attendus existent
export function checkScreens() {
  const names = ["pseudo", "intro", "game", "victory", "defeat"];
  names.forEach((name) => {
    const id = "screen-" + name;
    const el = document.getElementById(id);
    if (!el) derr(`Écran manquant: #${id}`);
    else dlog(`Écran présent: #${id}`);
  });
}

// Surveille la navigation d’écran (à utiliser autour de goToScreen)
export function wrapGoToScreen(goToScreenFn) {
  return (name) => {
    const id = "screen-" + name;
    dlog(`goToScreen("${name}") demandé -> #${id}`);
    const before = getVisibleScreenId();
    dlog(`Écran visible AVANT: ${before || "(aucun)"}`);
    goToScreenFn(name);
    const after = getVisibleScreenId();
    dlog(`Écran visible APRÈS: ${after || "(aucun)"}`);
    if (after !== id) {
      dwarn(`Après goToScreen("${name}"), l'écran visible attendu (#${id}) n'est pas actif.`);
    }
  };
}

function getVisibleScreenId() {
  const vis = Array.from(document.querySelectorAll(".screen"))
    .find(s => !s.classList.contains("hidden"));
  return vis ? vis.id : null;
}

// Diagnostics complets de base
export function runDiagnostics() {
  dash("Diagnostics");
  // 1) éléments clés
  assertEl("start-btn", "Bouton Commencer");
  assertEl("player-name", "Champ pseudo");
  assertEl("begin-game", "Bouton Entrer dans le royaume");
  // 2) écrans
  checkScreens();
  // 3) état visible
  const current = getVisibleScreenId();
  dlog("Écran visible au chargement:", current || "(aucun)");
}
