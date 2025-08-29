/* =======================
   State & constants
======================= */
let player = {
  name: "",
  bonusUsed: 0,
};
let currentRiddle = 1;
let timeLeft = 3600; // 60 min
let timerId = null;

// Admin: SHA-256 hash of default password "RoiDuRoyaume!2025"
let ADMIN_HASH = "5a77c2a8a8d93f4a8a6593e7b3b14e9d3a2b8a6f3e2b9c4c8b1c9a0d6d7a3c4b"; // placeholder; will be replaced on first run
const LS_KEY_HASH = "escape_admin_hash";
const LS_KEY_SCORES = "escape_scores";

// intro/ending texts with {name}
const introTexts = [
  n => `Un royaume oublié attend ses gardiens... ${n}, es-tu prêt à relever le défi ?`,
  n => `Les ombres s’épaississent, ${n}. Le destin du royaume repose entre tes mains.`,
  n => `${n}, entends-tu l’appel ? Le Royaume Oublié a besoin de toi.`,
];
const victoryTexts = [
  n => `Bravo ${n} ! Tu as restauré l’équilibre et sauvé le royaume.`,
  n => `${n}, ton courage a triomphé des ténèbres. Le peuple t’acclame !`,
  n => `La légende retiendra ton nom, ${n}. Tu es le gardien du Royaume Oublié.`,
];
const defeatTexts = [
  n => `Le temps est écoulé, ${n}. L’ombre a tout envahi...`,
  n => `Tu as échoué, ${n}. Le royaume s’enfonce dans le silence éternel.`,
  n => `Les ténèbres triomphent cette fois, ${n}. Mais l’espoir renaîtra.`,
];

/* =======================
   Utils
======================= */
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

function show(id){ $(id).classList.remove("hidden"); }
function hide(id){ $(id).classList.add("hidden"); }
function go(fromId, toId){ hide(fromId); show(toId); }

function formatTime(sec){
  const m = Math.floor(sec/60);
  const s = String(sec%60).padStart(2,"0");
  return `${m}:${s}`;
}

function typeWriter(text, el, speed=26, done){
  el.textContent = "";
  let i = 0;
  const t = setInterval(()=>{
    el.textContent += text[i++];
    if(i >= text.length){ clearInterval(t); done && done(); }
  }, speed);
}

async function sha256(text){
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,"0")).join("");
}

/* =======================
   Boot
======================= */
window.addEventListener("DOMContentLoaded", async () => {
  // Persist or initialize admin hash
  const stored = localStorage.getItem(LS_KEY_HASH);
  if(!stored){
    ADMIN_HASH = await sha256("RoiDuRoyaume!2025");
    localStorage.setItem(LS_KEY_HASH, ADMIN_HASH);
  } else {
    ADMIN_HASH = stored;
  }

  // Entrée = valider pseudo
  $("#pseudoInput").addEventListener("keydown", e=>{
    if(e.key === "Enter"){ e.preventDefault(); startIntro(); }
  });
  $("#btnPseudo").addEventListener("click", startIntro);

  // Admin open shortcuts
  let titleClicks = 0;
  $("#gameTitle").addEventListener("click", ()=>{
    titleClicks++;
    if(titleClicks >= 5){ openAdmin(); titleClicks = 0; }
    setTimeout(()=>titleClicks=0, 1000);
  });
  document.addEventListener("keydown", e=>{
    if(e.ctrlKey && e.altKey && e.key.toLowerCase() === "a"){ openAdmin(); }
  });

  // Intro -> Start
  $("#btnStart").addEventListener("click", startGame);

  // Answer inputs: Enter validates
  $$(".answer").forEach(inp=>{
    inp.addEventListener("keydown", e=>{
      if(e.key === "Enter"){ e.preventDefault(); validateAnswer(inp); }
    });
    // instant feedback on blur too
    inp.addEventListener("blur", ()=>validateAnswer(inp));
  });

  // End: replay
  $("#btnReplay").addEventListener("click", ()=>location.reload());

  // Tests
  $("#testWin").addEventListener("click", ()=>endGame(true));
  $("#testLose").addEventListener("click", ()=>endGame(false));

  // Admin events
  $("#btnAdminLogin").addEventListener("click", adminLogin);
  $("#adminPass").addEventListener("keydown", e=>{ if(e.key==="Enter"){ adminLogin(); }});
  $("#btnAdminBack").addEventListener("click", ()=>{
    go("#screen-admin","#screen-pseudo");
    $("#adminPass").value="";
    hide("#adminTools");
    show("#adminAuth");
  });
  $("#btnViewScores").addEventListener("click", adminViewScores);
  $("#btnExportScores").addEventListener("click", adminExport);
  $("#btnImportScores").addEventListener("click", adminImport);
  $("#btnClearScores").addEventListener("click", adminClearScores);
  $("#btnChangePass").addEventListener("click", adminChangePass);
});

/* =======================
   Flow
======================= */
function startIntro(){
  const name = $("#pseudoInput").value.trim();
  if(!name){ return; }

  player.name = name;
  $("#playerNameTag").textContent = `Aventurier : ${player.name}`;

  go("#screen-pseudo","#screen-intro");

  const t = introTexts[Math.floor(Math.random()*introTexts.length)](player.name);
  typeWriter(t, $("#introText"), 22, ()=> show("#btnStart"));
}

function startGame(){
  go("#screen-intro","#screen-game");
  show("#inventory"); // inventaire visible seulement maintenant
  startTimer();
  // donner un bonus de départ (exemple)
  addInventoryItem("⭐", "etoile", "Gagne 5 minutes");
}

function startTimer(){
  updateTimerLabel();
  timerId = setInterval(()=>{
    timeLeft--;
    updateTimerLabel();
    if(timeLeft <= 0){ endGame(false); }
  }, 1000);
}
function updateTimerLabel(){ $("#timer").textContent = `⏳ ${formatTime(timeLeft)}`; }

/* =======================
   Inventory / Bonus
======================= */
function addInventoryItem(symbol, id, title){
  const el = document.createElement("div");
  el.className = "inv-item";
  el.dataset.id = id;
  el.title = title;
  el.innerHTML = `<small>${symbol}</small>`;
  el.addEventListener("click", ()=>useBonus(id, el));
  $("#inventoryItems").appendChild(el);
}

function useBonus(id, el){
  if(id === "etoile"){
    timeLeft = Math.min(timeLeft + 300, 3600);
    player.bonusUsed++;
    el.remove();
  }
  if(id === "indice"){
    const r = document.querySelector(`.riddle:not(.hidden)`);
    if(r){
      const p = document.createElement("p");
      p.style.color = "#ddd";
      p.textContent = "Indice : pense au sens figuré…";
      r.appendChild(p);
      player.bonusUsed++;
      el.remove();
    }
  }
}

/* =======================
   Riddles
======================= */
function validateAnswer(input){
  const expected = (input.dataset.answer || "").trim().toLowerCase();
  const got = input.value.trim().toLowerCase();
  const error = input.parentElement.querySelector(".error");

  if(!expected) return;

  if(got === expected){
    error.classList.add("hidden");
    // show next riddle or finish
    const container = input.closest(".riddle");
    container.classList.add("solved");
    const next = container.nextElementSibling;
    container.classList.add("hidden");
    if(next && next.classList.contains("riddle")){
      next.classList.remove("hidden");
    } else {
      endGame(true);
    }
  } else {
    error.classList.remove("hidden");
  }
}

/* =======================
   Endings & Scores
======================= */
function endGame(victory){
  if(timerId) clearInterval(timerId);
  go("#screen-game","#screen-end");

  const set = victory ? victoryTexts : defeatTexts;
  const text = set[Math.floor(Math.random()*set.length)](player.name);
  typeWriter(text, $("#endText"), 22, ()=>{
    // afficher le tableau après la narration
    show("#scoreScreen");
  });

  // enregistrer le score
  const scores = JSON.parse(localStorage.getItem(LS_KEY_SCORES) || "[]");
  scores.push({
    pseudo: player.name,
    resultat: victory ? "Victoire" : "Défaite",
    temps: formatTime(timeLeft),
    bonus: player.bonusUsed
  });
  localStorage.setItem(LS_KEY_SCORES, JSON.stringify(scores));
  renderScores();
}

function renderScores(){
  const scores = JSON.parse(localStorage.getItem(LS_KEY_SCORES) || "[]");
  const body = $("#scoreTableBody");
  body.innerHTML = "";
  scores.forEach(s=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${s.pseudo}</td><td>${s.resultat}</td><td>${s.temps}</td><td>${s.bonus}</td>`;
    body.appendChild(tr);
  });
}

/* =======================
   Admin Panel (secured)
======================= */
function openAdmin(){
  hide("#screen-pseudo");
  hide("#screen-intro");
  hide("#screen-game");
  hide("#screen-end");
  show("#screen-admin");
}

async function adminLogin(){
  const pass = $("#adminPass").value;
  if(!pass) return;

  const hash = await sha256(pass);
  if(hash === localStorage.getItem(LS_KEY_HASH)){
    $("#adminPass").value = "";
    hide("#adminAuth");
    show("#adminTools");
    adminViewScores();
  } else {
    $("#adminPass").value = "";
    alert("Mot de passe incorrect.");
  }
}

function adminViewScores(){
  const scores = JSON.parse(localStorage.getItem(LS_KEY_SCORES) || "[]");
  const box = $("#adminScores");
  box.innerHTML = "";
  if(!scores.length){ box.textContent = "Aucun score enregistré."; return; }
  const pre = document.createElement("pre");
  pre.textContent = JSON.stringify(scores, null, 2);
  box.appendChild(pre);
}

function adminExport(){
  const scores = localStorage.getItem(LS_KEY_SCORES) || "[]";
  const blob = new Blob([scores], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "scores.json"; a.click();
  URL.revokeObjectURL(url);
}

function adminImport(){
  const input = document.createElement("input");
  input.type = "file"; input.accept = "application/json";
  input.onchange = e=>{
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ()=>{
      try{
        const data = JSON.parse(reader.result);
        if(Array.isArray(data)){
          localStorage.setItem(LS_KEY_SCORES, JSON.stringify(data));
          adminViewScores();
          renderScores();
          alert("Scores importés.");
        } else { alert("Fichier invalide."); }
      }catch{ alert("JSON invalide."); }
    };
    reader.readAsText(file);
  };
  input.click();
}

function adminClearScores(){
  if(confirm("Effacer tous les scores ? Cette action est irréversible.")){
    localStorage.removeItem(LS_KEY_SCORES);
    adminViewScores();
    renderScores();
  }
}

async function adminChangePass(){
  const p1 = prompt("Nouveau mot de passe admin :");
  if(!p1) return;
  const p2 = prompt("Confirmez le mot de passe :");
  if(p1 !== p2){ alert("Les mots de passe ne correspondent pas."); return; }
  const hash = await sha256(p1);
  localStorage.setItem(LS_KEY_HASH, hash);
  alert("Mot de passe modifié.");
}
