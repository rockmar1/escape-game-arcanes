// Intro narratives aléatoires
const introTexts = [
  "Les ténèbres s'étendent... Une aventure magique commence.",
  "Un royaume oublié attend ses gardiens... Êtes-vous prêt ?",
  "Les étoiles brillent, les ombres avancent... Entrez dans la légende."
];

// Fins possibles
const victoryTexts = [
  "Votre aventure fut parfaite ! Vous avez protégé le royaume sans aide extérieure.",
  "Avec courage et ruse, vous avez triomphé des ombres.",
  "Grâce à vos efforts, la lumière revient et le royaume est sauvé."
];
const defeatTexts = [
  "Le temps est écoulé... Les ténèbres s’abattent sur le royaume.",
  "Malgré vos efforts, le mal triomphe... Les habitants attendent votre retour.",
  "Vous avez échoué, mais chaque échec forge de nouveaux héros."
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

// Score stockage
let scores = [];

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
  typeWriter(randomText, introNarrative);
}

function startGame() {
  introScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  inventory.classList.remove("hidden");
  // Exemple de question
  document.getElementById("questionText").textContent = "Quelle est la formule magique de lumière ?";
}

function showEnd(victory = true) {
  gameScreen.classList.add("hidden");
  endScreen.classList.remove("hidden");
  const texts = victory ? victoryTexts : defeatTexts;
  const chosen = texts[Math.floor(Math.random() * texts.length)];
  typeWriter(chosen, finNarrative);

  // Ajout score
  scores.push({ pseudo: "Joueur", result: victory ? "Victoire" : "Défaite", time: "5min", bonus: "1" });
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

// Démarrage
showIntro();
