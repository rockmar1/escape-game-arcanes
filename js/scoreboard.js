const KEY = "escape_scores_v1";
export function saveScore(entry){
  // entry: {name, score, time, result}
  const arr = JSON.parse(localStorage.getItem(KEY) || "[]");
  arr.push(entry);
  localStorage.setItem(KEY, JSON.stringify(arr));
}
export function getScores(){
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}
export function renderScores(listId, limit=10){
  const ul = document.getElementById(listId);
  if(!ul) return;
  const scores = getScores().slice(-limit).reverse();
  ul.innerHTML = "";
  scores.forEach(s=>{
    const li = document.createElement("li");
    li.textContent = `${s.name} — ${s.result} — ${s.score} pts — ${s.time}s`;
    ul.appendChild(li);
  });
}
export function clearScores(){ localStorage.removeItem(KEY); }
