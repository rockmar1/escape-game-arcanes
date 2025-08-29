// -------------------------
// CONFIGURATION
// -------------------------
const debugMode = true;
const adminPassword = "admin123";

const Game = {
  pseudo: "",
  timeLeft: 3600,
  timer: null,
  inventory: [],
  journal: [],
  currentScreen: "screen-pseudo",

  intros: [
    "Un royaume oublié attend ses gardiens... {pseudo}, es-tu prêt à relever le défi ?",
    "Les ombres s'épaississent, {pseudo}. Le destin du royaume repose entre tes mains.",
    "{pseudo}, entends-tu l'appel ? Le Royaume Oublié a besoin de toi."
  ],

  victories: [
    "Bravo {pseudo} ! Tu as restauré l'équilibre et sauvé le royaume.",
    "{pseudo}, ton courage a triomphé des ténèbres. Le peuple t'acclame !",
    "La légende retiendra ton nom, {pseudo}. Tu es le gardien du Royaume Oublié."
  ],

  defeats: [
    "Le temps est écoulé, {pseudo}. L'ombre a tout envahi...",
    "Tu as échoué, {pseudo}. Le royaume s'enfonce dans le silence éternel.",
    "Les ténèbres triomphent cette fois, {pseudo}. Mais l'espoir renaîtra."
  ]
};

// -------------------------
// SONS
// -------------------------
const Sounds = {
  ambiance: new Audio('sons/ambiance.mp3'),
  bonus: new Audio('sons/bonus.mp3'),
  defaite: new Audio('sons/defaite.mp3'),
  enigme_reussie: new Audio('sons/enigme_reussie.mp3'),
  erreur: new Audio('sons/erreur.mp3'),
  intro: new Audio('sons/intro.mp3'),
  item: new Audio('sons/item.mp3'),
  scintillement: new Audio('sons/scintillement.mp3'),
  victoire: new Audio('sons/victoire.mp3')
};

function playSound(sound) { sound.currentTime=0; sound.play(); }

// -------------------------
// UTILITAIRES
// -------------------------
function logDebug(msg){ if(debugMode) console.log("[DEBUG]", msg); }
function formatTime(sec){ return `${Math.floor(sec/60)}:${(sec%60).toString().padStart(2,"0")}`; }
function switchScreen(screenId){
  document.querySelectorAll(".screen").forEach(s=>{s.classList.add("hidden"); s.style.opacity=0;});
  const screen = document.getElementById(screenId);
  screen.classList.remove("hidden");
  setTimeout(()=>screen.style.opacity=1,50);
  Game.currentScreen = screenId;
  logDebug("Écran affiché : "+screenId);
}

// -------------------------
// TYPEWRITER
// -------------------------
function typeWriter(text, elementId, callback){
  const el=document.getElementById(elementId);
  el.innerHTML="";
  let i=0;
  function typing(){ if(i<text.length){ el.innerHTML+=text.charAt(i); i++; setTimeout(typing,50);} else if(callback) callback();}
  typing();
}

// -------------------------
// START DU JEU
// -------------------------
function startIntro(){
  const input=document.getElementById("pseudoInput").value.trim();
  if(!input) return alert("Entrez un pseudo !");
  Game.pseudo=input;
  playSound(Sounds.intro);
  switchScreen("screen-intro");
  const introText=Game.intros[Math.floor(Math.random()*Game.intros.length)].replace("{pseudo}",Game.pseudo);
  typeWriter(introText,"introText",()=>document.getElementById("btnStart").classList.remove("hidden"));
}

// -------------------------
// JEU
// -------------------------
function startGame(){
  switchScreen("screen-game");
  document.getElementById("inventory").classList.remove("hidden");
  updateInventoryUI();
  startTimer();
  playSound(Sounds.ambiance);
}

// -------------------------
// TIMER
// -------------------------
function startTimer(){
  updateTimerDisplay();
  Game.timer=setInterval(()=>{
    Game.timeLeft--;
    if(Game.timeLeft<=0){ Game.timeLeft=0; updateTimerDisplay(); endGame(false);}
    else if(Game.timeLeft<=600) document.getElementById("timer").style.color="red";
    updateTimerDisplay();
  },1000);
}
function updateTimerDisplay(){ document.getElementById("timer").textContent=`Temps : ${formatTime(Game.timeLeft)}`; }

// -------------------------
// INVENTAIRE
// -------------------------
function addItem(name){
  if(!Game.inventory.includes(name)){
    Game.inventory.push(name);
    Game.journal.push(`Objet collecté : ${name}`);
    updateInventoryUI();
    updateJournalUI();
    playSound(Sounds.item);
  }
}
function removeItem(name){
  Game.inventory=Game.inventory.filter(i=>i!==name);
  Game.journal.push(`Objet retiré : ${name}`);
  updateInventoryUI();
  updateJournalUI();
}
function updateInventoryUI(){
  const ul=document.getElementById("inventoryList");
  ul.innerHTML="";
  Game.inventory.forEach(item=>{
    const li=document.createElement("li");
    li.textContent=item;
    li.classList.add(item.toLowerCase());
    li.addEventListener("click",()=>{if(confirm(`Supprimer ${item} ?`)) removeItem(item);});
    ul.appendChild(li);
  });
}
function updateJournalUI(){
  const ul=document.getElementById("journalList");
  ul.innerHTML="";
  Game.journal.forEach(line=>{
    const li=document.createElement("li");
    li.textContent=line;
    ul.appendChild(li);
  });
}

// -------------------------
// ÉNIGMES
// -------------------------
function checkAnswer(input){
  const correct=input.dataset.answer.toLowerCase();
  const user=input.value.trim().toLowerCase();
  const errorSpan=input.nextElementSibling;
  if(user===correct){ errorSpan.classList.add("hidden"); playSound(Sounds.enigme_reussie); Game.journal.push(`Énigme résolue : ${input.previousElementSibling.textContent}`); checkAllAnswers();}
  else{ errorSpan.classList.remove("hidden"); playSound(Sounds.erreur); }
}
function checkAllAnswers(){
  const allCorrect=Array.from(document.querySelectorAll(".answer")).every(input=>input.value.trim().toLowerCase()===input.dataset.answer.toLowerCase());
  if(allCorrect){ endGame(true); }
}

// -------------------------
// FIN DU JEU
// -------------------------
function endGame(victory){
  clearInterval(Game.timer);
  switchScreen("screen-end");
  const screenEnd=document.getElementById("screen-end");
  screenEnd.classList.remove("victoire","defaite");
  screenEnd.classList.add(victory?"victoire":"defaite");
  const text=(victory?Game.victories:Game.defeats)[Math.floor(Math.random()*3)].replace("{pseudo}",Game.pseudo);
  typeWriter(text,"endText",showScoreboard);
  saveScore(victory);
  playSound(victory?Sounds.victoire:Sounds.defaite);
}

// -------------------------
// SCORES
// -------------------------
function saveScore(victory){
  const scores=JSON.parse(localStorage.getItem("scores"))||[];
  const bonus=Math.floor(Game.timeLeft/60);
  scores.push({pseudo:Game.pseudo,result:victory?"Victoire":"Défaite",time:formatTime(Game.timeLeft),bonus:bonus});
  localStorage.setItem("scores",JSON.stringify(scores));
}
function showScoreboard(){
  const scores=JSON.parse(localStorage.getItem("scores"))||[];
  const tbody=document.getElementById("scoreList");
  tbody.innerHTML="";
  scores.forEach(s=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`<td>${s.pseudo}</td><td>${s.result}</td><td>${s.time}</td><td>${s.bonus}</td>`;
    tbody.appendChild(tr);
  });
}

// -------------------------
// REJOUER
// -------------------------
document.getElementById("btnReplay").addEventListener("click",()=>location.reload());

// -------------------------
// PANEL ADMIN
// -------------------------
function showAdminPanel(){
  const panel=document.createElement("div");
  panel.style.position="fixed"; panel.style.bottom="10px"; panel.style.right="10px";
  panel.style.background="rgba(0,0,0,0.7)"; panel.style.padding="10px"; panel.style.borderRadius="8px";
  panel.style.color="#ffd700"; panel.innerHTML=`<h4>Admin Panel</h4>
  <button id="btnClearScores">Supprimer Scores</button>
  <button id="btnAdminWin">Tester Victoire</button>
  <button id="btnAdminLose">Tester Défaite</button>`;
  document.body.appendChild(panel);
  document.getElementById("btnClearScores").addEventListener("click",()=>{
    if(confirm("Supprimer tous les scores ?")){
      localStorage.removeItem("scores");
      document.getElementById("scoreList").innerHTML="";
    }
  });
  document.getElementById("btnAdminWin").addEventListener("click",()=>endGame(true));
  document.getElementById("btnAdminLose").addEventListener("click",()=>endGame(false));
}
document.addEventListener("keydown", e=>{
  if(e.key==="F12"){
    const pass=prompt("Mot de passe admin :");
    if(pass===adminPassword) showAdminPanel();
    else alert("Mot de passe incorrect !");
  }
});

// -------------------------
// LISTENERS
// -------------------------
document.getElementById("btnPseudo").addEventListener("click", startIntro);
document.getElementById("pseudoInput").addEventListener("keypress",e=>{if(e.key==="Enter") startIntro();});
document.getElementById("btnStart").addEventListener("click", startGame);
document.querySelectorAll(".answer").forEach(input=>{
  input.addEventListener("keypress",e=>{if(e.key==="Enter") checkAnswer(input);});
  input.addEventListener("blur",e=>checkAnswer(input));
});
