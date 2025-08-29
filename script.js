// -------------------------
// CONFIGURATION
// -------------------------
const debugMode = true;
const adminPassword = "admin123"; // mot de passe pour le panel admin
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
// UTILITAIRES
// -------------------------
function logDebug(msg) { if (debugMode) console.log("[DEBUG]", msg); }

function formatTime(sec) {
  let minutes = Math.floor(sec / 60);
  let seconds = sec % 60;
  return `${minutes}:${seconds.toString().padStart(2,"0")}`;
}

// -------------------------
// GESTION DES ÉCRANS
// -------------------------
function switchScreen(screenId) {
  document.querySelectorAll(".screen").forEach(s => {
    s.classList.add("hidden");
    s.style.opacity = 0;
  });
  const screen = document.getElementById(screenId);
  screen.classList.remove("hidden");
  setTimeout(() => screen.style.opacity = 1, 50);
  Game.currentScreen = screenId;
  logDebug("Écran affiché : " + screenId);
}

// -------------------------
// ANIMATION TEXTE
// -------------------------
function typeWriter(text, elementId, callback) {
  const el = document.getElementById(elementId);
  el.innerHTML = "";
  let i = 0;
  const speed = 50;
  function typing() {
    if (i < text.length) {
      el.innerHTML += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    } else if (callback) callback();
  }
  typing();
}

// -------------------------
// START DU JEU
// -------------------------
function startIntro() {
  const input = document.getElementById("pseudoInput").value.trim();
  if (!input) return alert("Entrez un pseudo !");
  Game.pseudo = input;
  logDebug("Pseudo validé : " + Game.pseudo);
  switchScreen("screen-intro");
  const intro = Game.intros[Math.floor(Math.random() * Game.intros.length)].replace("{pseudo}", Game.pseudo);
  typeWriter(intro, "introText", () => {
    document.getElementById("btnStart").classList.remove("hidden");
  });
}

// -------------------------
// DÉBUT DU JEU
// -------------------------
function startGame() {
  switchScreen("screen-game");
  document.getElementById("inventory").classList.remove("hidden");
  updateInventoryUI();
  startTimer();
}

// -------------------------
// TIMER
// -------------------------
function startTimer() {
  updateTimerDisplay();
  Game.timer = setInterval(() => {
    Game.timeLeft--;
    if (Game.timeLeft <= 0) {
      Game.timeLeft = 0;
      updateTimerDisplay();
      endGame(false);
    } else if (Game.timeLeft <= 600) { // alerte à 10 minutes
      document.getElementById("timer").style.color = "red";
    }
    updateTimerDisplay();
  }, 1000);
}

function updateTimerDisplay() {
  document.getElementById("timer").textContent = `Temps : ${formatTime(Game.timeLeft)}`;
}

// -------------------------
// INVENTAIRE
// -------------------------
function addItem(name) {
  if (!Game.inventory.includes(name)) {
    Game.inventory.push(name);
    Game.journal.push(`Objet collecté : ${name}`);
    updateInventoryUI();
    logDebug("Item ajouté : " + name);
  }
}

function removeItem(name) {
  Game.inventory = Game.inventory.filter(i => i !== name);
  Game.journal.push(`Objet retiré : ${name}`);
  updateInventoryUI();
  logDebug("Item retiré : " + name);
}

function updateInventoryUI() {
  const ul = document.getElementById("inventoryList");
  ul.innerHTML = "";
  Game.inventory.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    li.addEventListener("click", () => {
      if (confirm(`Supprimer ${item} de l'inventaire ?`)) removeItem(item);
    });
    ul.appendChild(li);
  });
}

// -------------------------
// ÉNIGMES
// -------------------------
function checkAnswer(input) {
  const correct = input.dataset.answer.toLowerCase();
  const user = input.value.trim().toLowerCase();
  const errorSpan = input.nextElementSibling;

  if (user === correct) {
    errorSpan.classList.add("hidden");
    logDebug(`Réponse correcte : ${input.dataset.answer}`);
    Game.journal.push(`Énigme résolue : ${input.previousElementSibling.textContent}`);
    checkAllAnswers();
  } else {
    errorSpan.classList.remove("hidden");
    logDebug(`Réponse incorrecte : ${user}, attendu : ${correct}`);
  }
}

function checkAllAnswers() {
  const allCorrect = Array.from(document.querySelectorAll(".answer")).every(input =>
    input.value.trim().toLowerCase() === input.dataset.answer.toLowerCase()
  );
  if (allCorrect) {
    logDebug("Toutes les énigmes résolues !");
    endGame(true);
  }
}

// -------------------------
// FIN DU JEU
// -------------------------
function endGame(victory) {
  clearInterval(Game.timer);
  switchScreen("screen-end");
  const text = (victory ? Game.victories : Game.defeats)[Math.floor(Math.random() * 3)].replace("{pseudo}", Game.pseudo);
  typeWriter(text, "endText", showScoreboard);
  saveScore(victory);
}

// -------------------------
// SCOREBOARD
// -------------------------
function saveScore(victory) {
  const scores = JSON.parse(localStorage.getItem("scores")) || [];
  const bonus = Math.floor(Game.timeLeft / 60);
  scores.push({
    pseudo: Game.pseudo,
    result: victory ? "Victoire" : "Défaite",
    time: formatTime(Game.timeLeft),
    bonus: bonus
  });
  localStorage.setItem("scores", JSON.stringify(scores));
  logDebug("Score sauvegardé : " + JSON.stringify(scores[scores.length - 1]));
}

function showScoreboard() {
  const scores = JSON.parse(localStorage.getItem("scores")) || [];
  const tbody = document.getElementById("scoreList");
  tbody.innerHTML = "";
  scores.forEach(s => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${s.pseudo}</td><td>${s.result}</td><td>${s.time}</td><td>${s.bonus}</td>`;
    tbody.appendChild(tr);
  });
}

// -------------------------
// REJOUER
// -------------------------
document.getElementById("btnReplay").addEventListener("click", () => location.reload());

// -------------------------
// ADMIN PANEL SÉCURISÉ
// -------------------------
function showAdminPanel() {
  const panel = document.createElement("div");
  panel.style.position = "fixed";
  panel.style.bottom = "10px";
  panel.style.right = "10px";
  panel.style.background = "rgba(0,0,0,0.7)";
  panel.style.padding = "10px";
  panel.style.borderRadius = "8px";
  panel.style.color = "#ffd700";
  panel.innerHTML = `
    <h4>Admin Panel</h4>
    <button id="btnClearScores">Supprimer Scores</button>
    <button id="btnAdminWin">Tester Victoire</button>
    <button id="btnAdminLose">Tester Défaite</button>
  `;
  document.body.appendChild(panel);

  document.getElementById("btnClearScores").addEventListener("click", () => {
    if (confirm("Supprimer tous les scores ?")) {
      localStorage.removeItem("scores");
      document.getElementById("scoreList").innerHTML = "";
      alert("Scores supprimés !");
      logDebug("Scores effacés");
    }
  });

  document.getElementById("btnAdminWin").addEventListener("click", () => endGame(true));
  document.getElementById("btnAdminLose").addEventListener("click", () => endGame(false));
}

// Activation via mot de passe
document.addEventListener("keydown", e => {
  if (e.key === "F12") {
    const pass = prompt("Mot de passe admin :");
    if (pass === adminPassword) showAdminPanel();
    else alert("Mot de passe incorrect !");
  }
});

// -------------------------
// LISTENERS
// -------------------------
document.getElementById("btnPseudo").addEventListener("click", startIntro);
document.getElementById("pseudoInput").addEventListener("keypress", e => { if (e.key === "Enter") startIntro(); });
document.getElementById("btnStart").addEventListener("click", startGame);
document.querySelectorAll(".answer").forEach(input => {
  input.addEventListener("keypress", e => { if (e.key === "Enter") checkAnswer(input); });
  input.addEventListener("blur", e => checkAnswer(input));
});
