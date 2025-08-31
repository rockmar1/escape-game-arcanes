export function showScreen(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  const el = document.getElementById(id);
  if(el) el.classList.add("active");
}
export function goVictory(text){
  const t = document.querySelector(".end-text");
  if(t) t.textContent = text || "Victoire !";
  showScreen("screen-end");
}
