// ui.js
export function showScreen(screenId) {
    document.querySelectorAll(".screen").forEach(el => el.classList.add("hidden"));
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.remove("hidden");
        console.debug("[DEBUG] Écran affiché :", screenId);
    } else {
        console.error("[DEBUG] Écran introuvable :", screenId);
    }
}
