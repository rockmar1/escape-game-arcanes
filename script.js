// ==================
// Gestion globale
// ==================
const Game = {
  pseudo: "",
  intros: [
    "Bienvenue {pseudo}, le portail magique s'ouvre devant toi...",
    "{pseudo}, ta quête commence ici, sois prêt(e) à relever les défis..."
  ],
  timer: 60 * 60, // 60 minutes
  interval: null
};

// ==================
// Sons
// ==================
const Sounds = {
  ambiance: new Audio("sons/ambiance.mp3"),
  intro: new Audio("sons/intro.mp3"),
  victoire: new Audio("sons/victoire.mp3"),
  defaite: new Audio("sons/defaite.mp3"),
  erreur: new Audio("sons/erreur.mp3"),
  enigme_reussie: new Audio("sons/enigme_reussie.mp3"),
  item: new Audio("sons/item.mp3"),
  scintillement: new Audio("sons/scintillement.mp3")
};

function playSound(sound) {
  if (!sound) return;
  try { sound.play(); } catch(e) { console.warn("Son non lu :", e); }
}

// ==================
// Navigation
// ==================
function switchScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  const el = document.getElementById(id);
  if (el) {
    el.classList.remove("hidden");
    el.classList.add("active");
    console.log("[DEBUG] Écran affiché :", id);
  }
}

// ==================
// Intro
// ==================
document.getElementById("btnPseudo").addEventListener("click", startIntro);
document.getElementById("pseudoInput").addEventListener("keypress", e => { if (e.key==="Enter") startIntro(); });

function startIntro(){
  const input=document.getElementById("pseudoInput").value.trim();
  if(!input) return alert("Entrez un pseudo !");
  Game.pseudo=input;
  console.log("[DEBUG] Pseudo validé :", Game.pseudo);

  switchScreen("screen-intro");
  playSound(Sounds.intro);

  const text=Game.intros[Math.floor(Math.random()*Game.intros.length)].replace("{pseudo}",Game.pseudo);
  typeWriter(text,"introText",()=>document.getElementById("btnStart").classList.remove("hidden"));
}

document.getElementById("btnStart").addEventListener("click", startGame);

function typeWriter(text,id,callback){
  let i=0; const el=document.getElementById(id); el.textContent="";
  const timer=setInterval(()=>{
    el.textContent+=text.charAt(i);
    i++;
    if(i>=text.length){ clearInterval(timer); if(callback) callback(); }
  },50);
}

// ==================
// Jeu
// ==================
function startGame(){
  switchScreen("screen-game");
  playSound(Sounds.ambiance);
  startTimer();
}

function startTimer(){
  Game.interval=setInterval(()=>{
    Game.timer--;
    if(Game.timer<=0){ clearInterval(Game.interval); endGame(false); }
    const m=Math.floor(Game.timer/60), s=Game.timer%60;
    document.getElementById("timer").textContent=`⏳ ${m}:${s.toString().padStart(2,"0")}`;
  },1000);
}

document.getElementById("btnAnswer").addEventListener("click", checkAnswer);

function checkAnswer(){
  const answer=document.getElementById("answerInput").value.trim().toLowerCase();
  const feedback=document.getElementById("feedback");
  if(answer==="clé"){
    feedback.textContent="Bravo ! Vous avez trouvé la clé.";
    playSound(Sounds.enigme_reussie);
    addItem("clé");
  } else {
    feedback.textContent="Mauvaise réponse.";
    playSound(Sounds.erreur);
  }
}

function addItem(item){
  const li=document.createElement("li");
  li.className=item;
  li.textContent=item;
  document.getElementById("inventoryList").appendChild(li);
  playSound(Sounds.item);
  logJournal("Objet trouvé : "+item);
}

function logJournal(text){
  const li=document.createElement("li");
  li.textContent=text;
  document.getElementById("journalList").appendChild(li);
}

// ==================
// Fin
// ==================
function endGame(victory){
  clearInterval(Game.interval);
  switchScreen("screen-end");
  const end=document.getElementById("screen-end");
  if(victory){
    end.className="screen active victoire";
    document.getElementById("endTitle").textContent="Victoire !";
    playSound(Sounds.victoire);
  } else {
    end.className="screen active defaite";
    document.getElementById("endTitle").textContent="Défaite...";
    playSound(Sounds.defaite);
  }
}

// ==================
// Admin
// ==================
function toggleAdminPanel(){
  const pass=prompt("Mot de passe admin ?");
  if(pass==="secret123"){ document.getElementById("adminPanel").classList.toggle("hidden"); }
  else alert("Accès refusé");
}

function forceVictory(){ endGame(true); }
function forceDefeat(){ endGame(false); }
function resetScores(){ alert("Scores supprimés (placeholder)."); }

// Astuce : appuyer sur F10 pour ouvrir l’admin
document.addEventListener("keydown",e=>{ if(e.key==="F10") toggleAdminPanel(); });
