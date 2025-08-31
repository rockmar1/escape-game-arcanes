// ===============================
// Variables Globales
// ===============================
let playerName = "";
let timerInterval;
let timeLeft = 600; // 10 minutes
let currentScreen = "screen-start";
let gameState = {
  inventory: [],
  hintsEnabled: false,
  pseudo: "",
  victory: false,
  defeat: false
};

// Gestion musiques
let audio = {};
const audioFiles = {
  ambiance: "sons/ambiance.mp3",
  victoire: "sons/victoire.mp3",
  defaite: "sons/defaite.mp3",
  bonus: "sons/bonus.mp3",
  indice: "sons/indice.mp3",
  error: "sons/error.mp3",
  etoile: "sons/etoile.mp3",
  fiole: "sons/fiole.mp3",
  grimoire: "sons/grimoire.mp3",
  intro: "sons/intro.mp3",
};

// ===============================
// Utilitaires
// ===============================
function debug(msg) {
  console.log("[DEBUG]", msg);
}

function switchScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
  currentScreen = id;
  debug("Écran affiché : " + id);
}

// Jouer musique
function playMusic(key, loop = false, volume = 0.5) {
  stopAllMusic();
  if (audioFiles[key]) {
    audio[key] = new Audio(audioFiles[key]);
    audio[key].loop = loop;
    audio[key].volume = volume;
    audio[key].play().catch(e => console.warn("Audio bloqué :", e));
  }
}

function stopAllMusic() {
  for (let key in audio) {
    audio[key].pause();
    audio[key].currentTime = 0;
  }
}

// ===============================
// Timer avec accélération musique
// ===============================
function startTimer() {
  const timerEl = document.getElementById("timer");
  playMusic("ambiance", true, 0.4);

  timerInterval = setInterval(() => {
    timeLeft--;
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    timerEl.textContent = `⏳ ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

    // Accélère l'ambiance quand il reste < 2 minutes
    if (timeLeft < 120 && audio.ambiance) {
      audio.ambiance.playbackRate = 1.3;
    }
    if (timeLeft < 60 && audio.ambiance) {
      audio.ambiance.playbackRate = 1.6;
    }

    if (timeLeft <= 0) {
      endGame(false);
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

// ===============================
// Intro & Fin
// ===============================
const intros = [
  "✨ Bienvenue, voyageur {name}. Les étoiles murmurent ton destin...",
  "🌙 {name}, les portes du Royaume Oublié s’ouvrent devant toi...",
  "🔥 Une aura ancienne t’entoure, {name}. L’épreuve commence."
];

const victories = [
  "🎉 Bravo {name} ! Ton courage a illuminé le Royaume Oublié.",
  "🌟 {name}, les runes chantent ton nom. Tu es désormais Gardien.",
  "🏆 {name}, tu as restauré l’équilibre magique. Victoire !"
];

const defeats = [
  "💀 {name}, les ténèbres ont englouti ton âme…",
  "☠️ L’oubli a triomphé, {name}. Le Royaume s’efface.",
  "🌑 {name}, ton échec résonne dans l’éternité."
];

function showIntro() {
  let intro = intros[Math.floor(Math.random() * intros.length)];
  document.getElementById("intro-text").innerText = intro.replace("{name}", playerName);
  switchScreen("screen-intro");
  playMusic("intro", false, 0.6);
}

function endGame(victory = true) {
  stopTimer();
  stopAllMusic();
  let msg;
  if (victory) {
    msg = victories[Math.floor(Math.random() * victories.length)];
    playMusic("victoire", false, 0.6);
    gameState.victory = true;
  } else {
    msg = defeats[Math.floor(Math.random() * defeats.length)];
    playMusic("defaite", false, 0.6);
    gameState.defeat = true;
  }
  document.getElementById("end-text").innerText = msg.replace("{name}", playerName);
  switchScreen("screen-end");
}

// ===============================
// Gestion du jeu principal
// ===============================
function startGame() {
  switchScreen("screen-game");
  startTimer();
}

document.getElementById("start-btn").addEventListener("click", () => {
  let input = document.getElementById("pseudo-input").value.trim();
  if (input.length > 0) {
    playerName = input;
    gameState.pseudo = input;
    debug("Pseudo validé : " + playerName);
    showIntro();
  }
});

document.getElementById("begin-game").addEventListener("click", () => {
  startGame();
});

// ===============================
// Gestion Objets & Mini-jeux
// ===============================
document.querySelectorAll(".game-object").forEach(img => {
  img.addEventListener("click", () => {
    let obj = img.dataset.obj;
    debug("Objet cliqué : " + obj);
    triggerPuzzle(obj);
  });
});

function triggerPuzzle(obj) {
  switch(obj) {
    case "grimoire":
      switchScreen("screen-runes");
      startRunesPuzzle();
      break;
    case "fiole":
      switchScreen("screen-potions");
      startAlchemyPuzzle();
      break;
    case "cle":
      switchScreen("screen-labyrinth");
      startLabyrinthPuzzle();
      break;
    case "etoile":
      switchScreen("screen-stars");
      startStarsPuzzle();
      break;
  }
}

// ===============================
// Mini-jeux (versions simples)
// ===============================
function startRunesPuzzle() {
  let container = document.getElementById("runes-puzzle");
  container.innerHTML = "<p>Clique les runes dans l’ordre : M-A-G-I-E</p>";
}

function startAlchemyPuzzle() {
  let container = document.getElementById("potions-puzzle");
  container.innerHTML = "<p>Mélange les ingrédients dans le bon ordre…</p>";
}

function startLabyrinthPuzzle() {
  let canvas = document.getElementById("labyrinth-canvas");
  let ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0,0,400,400);
  ctx.fillStyle = "black";
  ctx.fillRect(50,50,300,300);
}

function startStarsPuzzle() {
  let container = document.getElementById("stars-puzzle");
  container.innerHTML = "<p>Mémorise la constellation…</p>";
}

// ===============================
// Quitter un puzzle
// ===============================
document.querySelectorAll(".quit-puzzle").forEach(btn => {
  btn.addEventListener("click", () => {
    switchScreen("screen-game");
  });
});

// ===============================
// Panel Admin
// ===============================
// Mot de passe hashé simple (sha256 d'une clé)
const ADMIN_PASS_HASH = "0a3d9f18dfe8ab8c152f30f3d2c729e6";

function hash(s) {
  return CryptoJS.MD5(s).toString();
}

// Ouvrir connexion admin via Ctrl+M
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "m") {
    switchScreen("admin-login");
  }
});

document.getElementById("admin-connect").addEventListener("click", () => {
  let pass = document.getElementById("admin-password").value;
  if (hash(pass) === ADMIN_PASS_HASH) {
    document.getElementById("admin-error").classList.add("hidden");
    document.getElementById("admin-login").classList.add("hidden");
    document.getElementById("admin-panel").classList.remove("hidden");
  } else {
    document.getElementById("admin-error").classList.remove("hidden");
  }
});

// Boutons panel
document.getElementById("admin-victory").addEventListener("click", () => endGame(true));
document.getElementById("admin-defeat").addEventListener("click", () => endGame(false));
document.getElementById("admin-reset").addEventListener("click", () => location.reload());
document.getElementById("admin-skip").addEventListener("click", () => {
  switchScreen("screen-game");
});
document.getElementById("admin-toggle-hints").addEventListener("click", () => {
  gameState.hintsEnabled = !gameState.hintsEnabled;
});
document.getElementById("admin-status").addEventListener("click", () => {
  document.getElementById("admin-output").innerText = JSON.stringify(gameState, null, 2);
});

// ===============================
// Restart
// ===============================
document.getElementById("restart-btn").addEventListener("click", () => {
  location.reload();
});
