// Intro narratives personnalisées
const introTexts = [
  (name) => `Les ténèbres s'étendent... ${name}, seul toi peux protéger le royaume.`,
  (name) => `Un royaume oublié attend ses gardiens... ${name}, es-tu prêt à relever le défi ?`,
  (name) => `${name}, les étoiles brillent et les ombres avancent... Entre dans la légende.`
];

// Fins possibles avec pseudo
const victoryTexts = [
  (name) => `Votre aventure fut parfaite, ${name} ! Vous avez protégé le royaume sans aide extérieure.`,
  (name) => `Avec courage et ruse, ${name}, vous avez triomphé des ombres.`,
  (name) => `Grâce à vos efforts, ${name}, la lumière revient et le royaume est sauvé.`
];
const defeatTexts = [
  (name) => `Le temps est écoulé, ${name}... Les ténèbres s’abattent sur le royaume.`,
  (name) => `Malgré tes efforts, ${name}, le mal triomphe... Les habitants attendent ton retour.`,
  (name) => `${name}, tu as échoué, mais chaque échec forge de nouveaux héros.`
];

// Elements
const introScreen = document.getElementById("introScreen");
const gameScreen = document.getElementById("gameScreen");
const endScreen = document.getElementById("endScreen");
const introNarrative = document.getElementById("introNarrative");
const finNarrative = document.getElementById("finNarrative");
const inventory = document.getElementById("inventory");
const feedback = document.getElementById("feedback");
const scoreTableBody = document.getElementById("scoreTableBody");

let playerName = "";
let scores = JSON.parse(localStorage.getItem("scores")) || [];

// ---- Fonctions ----
function typeWriter(text, element, speed = 40) {
  element.innerHTML = "";
  let i = 0;
  const interval = setInterval(() => {
    element.innerHTML += text.charAt(i);
    i++;
    if (i >= text.length) clearInterval(interval);
  }, speed);
}

function showIntro() {
  const randomText = introTexts[Math.floor(Math.random() * introTexts.length)];
  typeWriter(randomText(playerName), introNarrative);
  introNarrative.classList.remove("hidden");
  document.getElementById("startGame").classList.remove("hidden");
}

function startGame() {
  introScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  inventory.classList.remove("hidden");
  document.getElementById("questionText").textContent = "Quelle est la formule magique de lumière ?";
}

function showEnd(victory = true) {
  gameScreen.classList.add("hidden");
  endScreen.classList.remove("hidden");
  const texts = victory ? victoryTexts : defeatTexts;
  const chosen = texts[Math.floor(Math.random() * texts.length)];
  typeWriter(chosen(playerName), finNarrative);

  // Ajout score
  scores.push({ pseudo: playerName, result: victory ? "Victoire" : "Défaite", time: "5min", bonus: "1" });
  localStorage.setItem("scores", JSON.stringify(scores));
  updateScoreboard();
}

function updateScoreboard() {
  scoreTableBody.innerHTML = "";
  scores.forEach(s => {
    const row = `<tr><td>${s.pseudo}</td><td>${s.result}</td><td>${s.time}</td><td>${s.bonus}</td></tr>`;
    scoreTableBody.innerHTML += row;
  });
}

// ---- Events ----
document.getElementById("savePseudo").addEventListener("click", () => {
  const input = document.getElementById("playerName").value.trim();
  if (input.length > 0) {
    playerName = input;
    document.getElementById("pseudoForm").classList.add("hidden");
    showIntro();
  }
});

document.getElementById("startGame").addEventListener("click", startGame);
document.getElementById("restartGame").addEventListener("click", () => location.reload());

document.getElementById("answerForm").addEventListener("submit", e => {
  e.preventDefault();
  const answer = document.getElementById("answerInput").value.trim().toLowerCase();
  if (answer === "lumos") {
    feedback.innerHTML = "✅ Bonne réponse !";
  } else {
    feedback.innerHTML = "<span class='cross'>✖</span>";
  }
});

// Test boutons
document.getElementById("testWin").addEventListener("click", () => showEnd(true));
document.getElementById("testLose").addEventListener("click", () => showEnd(false));

// Admin : effacer scores
document.getElementById("clearScores").addEventListener("click", () => {
  const pass = prompt("Mot de passe admin requis pour supprimer les scores :");
  if (pass === "secret123") { // 🔑 change ici ton mot de passe admin
    scores = [];
    localStorage.setItem("scores", JSON.stringify(scores));
    updateScoreboard();
    alert("Scores effacés !");
  } else {
    alert("Mot de passe incorrect !");
  }
});

// Init
updateScoreboard();
