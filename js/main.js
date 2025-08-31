// 🎮 État global
const GameState = {
  player: { name: "", score: 0 },
  timer: 600,
  puzzles: { runes: false, potions: false, labyrinthe: false, etoiles: false },
  victory: false,
  defeat: false
};

// 🔀 Navigation
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  console.log("[DEBUG] Écran affiché :", id);
}

// 🎬 Intro dynamique
function startGame() {
  const name = document.getElementById("player-name").value.trim();
  if (!name) return alert("Entre ton pseudo !");
  GameState.player.name = name;
  document.getElementById("player-display").textContent = `Joueur : ${name}`;
  
  document.getElementById("intro-story").textContent =
    `Bienvenue ${name}, les runes t’attendaient... ton destin se scelle ici.`;
  
  showScreen("screen-intro");
}

// 🚪 Entrée dans le château
function beginIntro() {
  startTimer();
  playAmbiance();
  showScreen("screen-game");
}

// ⏳ Timer + accélération musique
function startTimer() {
  const timerEl = document.getElementById("timer-display");
  const interval = setInterval(() => {
    if (GameState.victory || GameState.defeat) return clearInterval(interval);
    GameState.timer--;
    timerEl.textContent = GameState.timer;

    if (GameState.timer <= 0) {
      triggerDefeat("Le temps s’est écoulé... les ombres t’engloutissent.");
      clearInterval(interval);
    }

    // Accélération musique si temps < 60s
    if (GameState.timer === 60) speedUpAmbiance();
  }, 1000);
}

// 🎉 Victoire / Défaite
function triggerVictory(text) {
  GameState.victory = true;
  stopAllAudio();
  playVictory();
  document.getElementById("victory-story").textContent = text;
  showScreen("screen-victory");
}

function triggerDefeat(text) {
  GameState.defeat = true;
  stopAllAudio();
  playDefeat();
  document.getElementById("defeat-story").textContent = text;
  showScreen("screen-defeat");
}

// 🚀 Init
document.getElementById("start-btn").addEventListener("click", startGame);
document.getElementById("begin-game").addEventListener("click", beginIntro);
