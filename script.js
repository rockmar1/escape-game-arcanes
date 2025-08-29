/* --------------- CONFIG --------------- */
const DEBUG = true;
const ADMIN_PASSWORD = "admin123"; // change si besoin

const Game = {
  pseudo: "",
  timeLeft: 60*60, // secondes
  timerId: null,
  inventory: [],
  journal: [],
  intros: [
    "Un royaume oublié attend ses gardiens... {pseudo}, es-tu prêt à relever le défi ?",
    "Les ombres s'épaississent, {pseudo}. Le destin du royaume repose entre tes mains.",
    "{pseudo}, entends-tu l'appel ? Le Royaume Oublié a besoin de toi."
  ],
  victories: [
    "Bravo {pseudo} ! Tu as restauré l'équilibre et sauvé le royaume.",
    "{pseudo}, ton courage a triomphé des ténèbres. Le peuple t'acclame !"
  ],
  defeats: [
    "Le temps est écoulé, {pseudo}. L'ombre a tout envahi...",
    "Tu as échoué, {pseudo}. Le royaume s'enfonce dans le silence éternel."
  ]
};

/* --------------- SONS (sécurisés) --------------- */
const Sounds = {
  ambiance: safeAudio('sons/ambiance.mp3'),
  intro: safeAudio('sons/intro.mp3'),
  enigme_reussie: safeAudio('sons/enigme_reussie.mp3'),
  erreur: safeAudio('sons/erreur.mp3'),
  item: safeAudio('sons/item.mp3'),
  victoire: safeAudio('sons/victoire.mp3'),
  defaite: safeAudio('sons/defaite.mp3')
};

function safeAudio(path){
  try { return new Audio(path); } catch(e){ log('Audio load failed: '+path); return null; }
}
function playSound(sound){
  if(!sound) return;
  try { sound.currentTime = 0; sound.play().catch(()=>{/* autoplay blocked */}); } catch(e){ /* ignore */ }
}

/* --------------- UTIL --------------- */
function log(...args){ if(DEBUG) console.log(...args); }
function formatTime(sec){ const m = Math.floor(sec/60); const s = sec%60; return `${m}:${s.toString().padStart(2,'0')}`; }

/* --------------- SCREEN MANAGEMENT (fix superposition) --------------- */
function switchScreen(id){
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if(!el) return log('switchScreen: element not found', id);
  el.classList.add('active');
  log('[DEBUG] Écran affiché :', id);
}

/* --------------- TYPEWRITER (intro) --------------- */
function typeWriter(text, targetId, speed=40, cb){
  const el = document.getElementById(targetId);
  el.textContent = '';
  let i = 0;
  const timer = setInterval(()=>{
    el.textContent += text.charAt(i);
    i++;
    if(i >= text.length){ clearInterval(timer); if(cb) cb(); }
  }, speed);
}

/* --------------- START / INTRO --------------- */
const btnPseudo = document.getElementById('btnPseudo');
const pseudoInput = document.getElementById('pseudoInput');
const btnStart = document.getElementById('btnStart');

btnPseudo.addEventListener('click', startIntro);
pseudoInput.addEventListener('keydown', e => { if(e.key === 'Enter') startIntro(); });

function startIntro(){
  const name = pseudoInput.value.trim();
  if(!name){ alert('Entrez un pseudo !'); return; }
  Game.pseudo = name;
  log('[DEBUG] Pseudo validé :', Game.pseudo);

  // switch to intro screen
  switchScreen('screen-intro');

  // play intro sound (user gesture present because click triggered)
  playSound(Sounds.intro);

  // typewriter
  const txt = Game.intros[Math.floor(Math.random()*Game.intros.length)].replace('{pseudo}', Game.pseudo);
  typeWriter(txt, 'introText', 45, ()=>{
    btnStart.style.display = 'inline-block';
  });
}

/* Launch game */
btnStart.addEventListener('click', () => {
  switchScreen('screen-game');
  startTimer();
  // start ambiance (user clicked)
  playSound(Sounds.ambiance);
});

/* --------------- TIMER --------------- */
function startTimer(){
  // if timer running, clear first
  if(Game.timerId) clearInterval(Game.timerId);
  // ensure timeLeft initialised if needed
  if(typeof Game.timeLeft !== 'number') Game.timeLeft = 60*60;
  updateTimerUI();
  Game.timerId = setInterval(()=>{
    Game.timeLeft--;
    if(Game.timeLeft <= 0){ Game.timeLeft = 0; updateTimerUI(); endGame(false); return; }
    // color change when low
    const timerEl = document.getElementById('timer');
    if(Game.timeLeft <= 600) timerEl.style.color = '#ff6b6b';
    updateTimerUI();
  }, 1000);
}
function updateTimerUI(){ document.getElementById('timer').textContent = 'Temps : ' + formatTime(Game.timeLeft); }

/* --------------- INVENTAIRE / JOURNAL --------------- */
function addItem(name){
  if(Game.inventory.includes(name)) return;
  Game.inventory.push(name);
  Game.journal.push(`Objet collecté : ${name}`);
  updateInventoryUI();
  updateJournalUI();
  playSound(Sounds.item);
}
function removeItem(name){
  Game.inventory = Game.inventory.filter(i => i !== name);
  Game.journal.push(`Objet retiré : ${name}`);
  updateInventoryUI();
  updateJournalUI();
}
function updateInventoryUI(){
  const ul = document.getElementById('inventoryList');
  ul.innerHTML = '';
  Game.inventory.forEach(it => {
    const li = document.createElement('li');
    li.textContent = it;
    li.classList.add(it.toLowerCase());
    li.title = `Cliquer pour supprimer ${it}`;
    li.addEventListener('click', ()=> { if(confirm(`Supprimer ${it} de l'inventaire ?`)) removeItem(it); });
    ul.appendChild(li);
  });
}
function updateJournalUI(){
  const ul = document.getElementById('journalList');
  ul.innerHTML = '';
  Game.journal.slice().reverse().forEach(line => {
    const li = document.createElement('li'); li.textContent = line; ul.appendChild(li);
  });
}

/* --------------- ÉNIGMES --------------- */
function initEnigmesListeners(){
  document.querySelectorAll('.answer').forEach(input => {
    input.addEventListener('keydown', e => { if(e.key === 'Enter') handleAnswerInput(input); });
    input.addEventListener('blur', () => handleAnswerInput(input));
  });
}
function handleAnswerInput(input){
  const expected = (input.dataset.answer || '').toLowerCase().trim();
  const got = (input.value || '').toLowerCase().trim();
  const errorSpan = input.parentElement.querySelector('.error');
  if(got === expected && expected !== ''){
    errorSpan.classList.remove('visible'); errorSpan.style.display = 'none';
    // feedback success
    playSound(Sounds.enigme_reussie);
    Game.journal.push(`Énigme résolue : ${input.previousElementSibling?.textContent || 'énigme'}`);
    updateJournalUI();
    // mark input disabled
    input.disabled = true;
    checkAllSolved();
  } else {
    // show error if non-empty
    if(got.length > 0){ errorSpan.classList.add('visible'); errorSpan.style.display = 'inline'; playSound(Sounds.erreur); }
    else { errorSpan.classList.remove('visible'); errorSpan.style.display = 'none'; }
  }
}
function checkAllSolved(){
  const all = Array.from(document.querySelectorAll('.answer'));
  const ok = all.every(i => (i.value || '').toLowerCase().trim() === (i.dataset.answer || '').toLowerCase().trim());
  if(ok){ log('Toutes les énigmes sont résolues'); endGame(true); }
}

/* --------------- FIN / SCORE --------------- */
function endGame(victory){
  if(Game.timerId) clearInterval(Game.timerId);
  // set background class on end screen for image (CSS controls .victoire/.defaite)
  const endSec = document.getElementById('screen-end');
  endSec.classList.remove('victoire','defaite');
  endSec.classList.add(victory ? 'victoire' : 'defaite');

  // message
  const msg = (victory ? Game.victories[Math.floor(Math.random()*Game.victories.length)]
                       : Game.defeats[Math.floor(Math.random()*Game.defeats.length)]).replace('{pseudo}', Game.pseudo);
  document.getElementById('endText').textContent = msg;

  // save score
  saveScore(victory);

  // show screen
  switchScreen('screen-end');

  // play sound
  playSound(victory ? Sounds.victoire : Sounds.defaite);

  // show scoreboard
  renderScores();
}

function saveScore(victory){
  try {
    const scores = JSON.parse(localStorage.getItem('scores') || '[]');
    const bonus = Math.floor(Game.timeLeft / 60);
    scores.push({ pseudo: Game.pseudo, result: victory ? 'Victoire' : 'Défaite', time: formatTime(Game.timeLeft), bonus });
    localStorage.setItem('scores', JSON.stringify(scores));
  } catch(e){ log('saveScore error', e); }
}
function renderScores(){
  const tbody = document.getElementById('scoreList');
  tbody.innerHTML = '';
  const scores = JSON.parse(localStorage.getItem('scores') || '[]');
  scores.slice().reverse().forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${s.pseudo}</td><td>${s.result}</td><td>${s.time}</td><td>${s.bonus}</td>`;
    tbody.appendChild(tr);
  });
}

/* --------------- ADMIN (secure) --------------- */
let adminVisible = false;
function showAdminPanel(){
  if(adminVisible) return;
  const holder = document.getElementById('adminHolder');
  const panel = document.createElement('div');
  panel.id = 'adminPanel';
  panel.style.background = 'rgba(0,0,0,0.8)';
  panel.style.border = '2px solid #ffd700';
  panel.style.padding = '8px';
  panel.style.borderRadius = '8px';
  panel.style.color = '#ffd700';
  panel.innerHTML = `
    <strong>Admin</strong><br/>
    <button id="adminWin">Forcer Victoire</button>
    <button id="adminLose">Forcer Défaite</button>
    <button id="adminClear">Suppr. scores</button>
    <button id="adminHide">Fermer</button>
  `;
  holder.appendChild(panel);
  adminVisible = true;

  document.getElementById('adminWin').addEventListener('click', ()=>endGame(true));
  document.getElementById('adminLose').addEventListener('click', ()=>endGame(false));
  document.getElementById('adminClear').addEventListener('click', ()=>{ if(confirm('Supprimer tous les scores ?')){ localStorage.removeItem('scores'); renderScores(); alert('Scores supprimés'); } });
  document.getElementById('adminHide').addEventListener('click', ()=>{ panel.remove(); adminVisible = false; });
}

// toggle admin — secure prompt (Ctrl+Shift+A)
document.addEventListener('keydown', e => {
  if(e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a'){
    const pass = prompt('Mot de passe admin :');
    if(pass === ADMIN_PASSWORD) showAdminPanel();
    else alert('Mot de passe incorrect');
  }
});

/* --------------- BOOTSTRAP --------------- */
function init(){
  // ensure only the pseudo screen is shown at start
  switchScreen('screen-pseudo');

  // init listeners for enigmes
  initEnigmesListeners();

  // test add-item button (dev)
  const btnAdd = document.getElementById('btnTestAddItem');
  if(btnAdd) btnAdd.addEventListener('click', ()=> addItem('clé'));

  // replay button
  const btnReplay = document.getElementById('btnReplay');
  if(btnReplay) btnReplay.addEventListener('click', ()=> location.reload());

  // render scoreboard now (if any)
  renderScores();

  log('Init complete');
}

init();
