let pseudo = "";
let timer;
let timeLeft = 3600; // 1h

// Textes d'intro
const intros = [
  "Un royaume oublié attend ses gardiens... {pseudo}, es-tu prêt à relever le défi ?",
  "Les ombres s'épaississent, {pseudo}. Le destin du royaume repose entre tes mains.",
  "{pseudo}, entends-tu l'appel ? Le Royaume Oublié a besoin de toi."
];

// Fins victorieuses
const victories = [
  "Bravo {pseudo} ! Tu as restauré l'équilibre et sauvé le royaume.",
  "{pseudo}, ton courage a triomphé des ténèbres. Le peuple t'acclame !",
  "La légende retiendra ton nom, {pseudo}. Tu es le gardien du Royaume Oublié."
];

// Fins défaites
const defeats = [
  "Le temps est écoulé, {pseudo}. L'ombre a tout envahi...",
  "Tu as échoué, {pseudo}. Le royaume s'enfonce dans le silence éternel.",
  "Les ténèbres triomphent cette fois, {pseudo}. Mais l'espoir renaîtra."
];

// Validation du pseudo
document.getElementById("btnPseudo").addEventListener("click", startIntro);
document.getElementById("pseudoInput").addEventListener("keypress", e => {
  if (e.key === "Enter") startIntro();
});

function startIntro() {
  pseudo = document.getElementById("pseudoInput").value.trim();
  if (!pseudo) return alert("Entrez un pseudo !");
  
  document.getElementById("screen-pseudo").classList.add("hidden");
  document.getElementById("screen-intro").classList.remove("hidden");

  let intro = intros[Math.floor(Math.random() * intros.length)].replace("{pseudo}", pseudo);
  typeWriter(intro, "introText", () => {
    document.getElementById("btnStart").classList.remove("hidden");
  });
}

// Animation écriture plume
function typeWriter(text, elementId, callback) {
  let i = 0;
  let speed = 50;
  let el = document.getElementById(elementId);
  el.innerHTML = "";

  function typing() {
    if (i < text.length) {
      el.innerHTML += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    } else if (callback) {
      callback();
    }
  }
  typing();
}

// Démarrer le jeu
document.getElementById("btnStart").addEventListener("click", () => {
  document.getElementById("screen-intro").classList.add("hidden");
  document.getElementById("screen-game").classList.remove("hidden");
  document.getElementById("inventory").classList.remove("hidden");
  startTimer();
});

// Timer
function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    document.getElementById("timer").textContent = `Temps : ${minutes}:${seconds.toString().padStart(2,"0")}`;
    if (timeLeft <= 0) endGame(false);
  }, 1000);
}

// Réponses aux énigmes
document.querySelectorAll(".answer").forEach(input => {
  input.addEventListener("keypress", e => {
    if (e.key === "Enter") checkAnswer(e.target);
  });
  input.addEventListener("blur", e => checkAnswer(e.target));
});

function checkAnswer(input) {
  let correct = input.dataset.answer.toLowerCase();
  let user = input.value.trim().toLowerCase();
  let errorSpan = input.nextElementSibling;
  if (user === correct) {
    errorSpan.classList.add("hidden");
  } else {
    errorSpan.classList.remove("hidden");
  }
}

// Fin du jeu
function endGame(victory) {
  clearInterval(timer);
  document.getElementById("screen-game").classList.add("hidden");
  document.getElementById("screen-end").classList.remove("hidden");

  let text;
  if (victory) {
    text = victories[Math.floor(Math.random() * victories.length)];
  } else {
    text = defeats[Math.floor(Math.random() * defeats.length)];
  }
  text = text.replace("{pseudo}", pseudo);

  typeWriter(text, "endText", showScoreboard);
  saveScore(victory);
}

// Sauvegarde et affichage des scores
function saveScore(victory) {
  let scores = JSON.parse(localStorage.getItem("scores")) || [];
  scores.push({
    pseudo: pseudo,
    result: victory ? "Victoire" : "Défaite",
    time: formatTime(timeLeft),
    bonus: "0"
  });
  localStorage.setItem("scores", JSON.stringify(scores));
}

function showScoreboard() {
  let scores = JSON.parse(localStorage.getItem("scores")) || [];
  let tbody = document.getElementById("scoreList");
  tbody.innerHTML = "";
  scores.forEach(s => {
    let tr = document.createElement("tr");
    tr.innerHTML = `<td>${s.pseudo}</td><td>${s.result}</td><td>${s.time}</td><td>${s.bonus}</td>`;
    tbody.appendChild(tr);
  });
}

function formatTime(sec) {
  let minutes = Math.floor(sec / 60);
  let seconds = sec % 60;
  return `${minutes}:${seconds.toString().padStart(2,"0")}`;
}

// Bouton rejouer
document.getElementById("btnReplay").addEventListener("click", () => {
  location.reload();
});

// Boutons de test
document.getElementById("btnTestWin").addEventListener("click", () => endGame(true));
document.getElementById("btnTestLose").addEventListener("click", () => endGame(false));
