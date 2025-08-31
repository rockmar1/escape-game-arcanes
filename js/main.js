// ===============================
// main.js — GameState, navigation, intro/fin, timer, hooks puzzles
// ===============================

const GameState = {
  player: { name: "", score: 0 },
  timer: 600,
  puzzles: { runes: false, potions: false, labyrinthe: false, etoiles: false },
  victory: false,
  defeat: false,
  timerInterval: null,
};

// Textes d’intros / fins (variés & immersifs)
const INTROS = [
  "✨ {name}, l’ancienne porte s’ouvre dans un soupir de poussière d’étoiles.",
  "🌙 Les constellations te reconnaissent, {name}. Entre, le sort est jeté.",
  "🔥 Les braises du destin rougeoient pour toi, {name}. Ose franchir le seuil."
];

const VICTORIES = [
  "🌟 {name}, les runes chantent ton nom. Tu es désormais Gardien du Royaume.",
  "🏆 {name}, ta lumière a traversé les ombres : l’équilibre est restauré.",
  "🎉 {name}, les tours s’illuminent et les esprits te saluent. Victoire !"
];

const DEFEATS = [
  "☠️ {name}, les ténèbres referment leur poing glacé…",
  "🌑 {name}, l’oubli t’engloutit. Le Royaume se tait.",
  "💀 {name}, le grimoire se ferme sans toi. Défaite."
];

// Affichage d’un écran (cache les autres)
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  console.log("[DEBUG] Écran affiché :", id);
}

// Démarrage : saisie pseudo → intro
function startGame() {
  const name = document.getElementById("player-name").value.trim();
  if (!name) return alert("Entre ton pseudo !");
  GameState.player.name = name;
  document.getElementById("player-display").textContent = `Joueur : ${name}`;
  // intro text
  const line = INTROS[Math.floor(Math.random()*INTROS.length)].replace("{name}", name);
  document.getElementById("intro-story").textContent = line;

  // musique d’intro
  AudioBus.stopAllAudio();
  AudioBus.playIntro();

  showScreen("screen-intro");
}

// Entrer dans le château → timer + ambiance
function beginIntro() {
  if (GameState.victory || GameState.defeat) return;
  showScreen("screen-game");
  startTimer();
  AudioBus.playAmbiance();
}

// Timer + accélération ambiance
function startTimer() {
  const el = document.getElementById("timer-display");
  clearInterval(GameState.timerInterval);
  GameState.timerInterval = setInterval(() => {
    if (GameState.victory || GameState.defeat) {
      clearInterval(GameState.timerInterval);
      return;
    }
    GameState.timer--;
    el.textContent = GameState.timer;

    // Intensité 0→1 en fonction du temps restant
    const max = 600; // 10 min
    const t = Math.max(0, Math.min(1, 1 - GameState.timer / max));
    AudioBus.speedUpAmbiance(t);

    if (GameState.timer <= 0) {
      clearInterval(GameState.timerInterval);
      triggerDefeat("Le sablier s’est vidé : la nuit gagne les remparts…");
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(GameState.timerInterval);
}

// Victoire / Défaite
function triggerVictory(text) {
  if (GameState.victory || GameState.defeat) return;
  GameState.victory = true;
  stopTimer();
  AudioBus.stopAllAudio();
  AudioBus.playVictory();
  const line = (text || VICTORIES[Math.floor(Math.random()*VICTORIES.length)])
                .replace("{name}", GameState.player.name);
  document.getElementById("victory-story").textContent = line;
  showScreen("screen-victory");
}

function triggerDefeat(text) {
  if (GameState.victory || GameState.defeat) return;
  GameState.defeat = true;
  stopTimer();
  AudioBus.stopAllAudio();
  AudioBus.playDefeat();
  const line = (text || DEFEATS[Math.floor(Math.random()*DEFEATS.length)])
                .replace("{name}", GameState.player.name);
  document.getElementById("defeat-story").textContent = line;
  showScreen("screen-defeat");
}

// Ouverture des puzzles (boutons de l’écran jeu)
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".open-puzzle");
  if (!btn) return;
  const p = btn.dataset.puzzle;
  Puzzles.start(p);
});

// Hooks UI
document.getElementById("start-btn").addEventListener("click", startGame);
document.getElementById("begin-game").addEventListener("click", beginIntro);
