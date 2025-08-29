// === Config global ===
const Config = {
  time: 3600, // 1h
  musicMaxSpeed: 1.7,
  volumes: { ambiance: 0.3, effets: 0.2, fin: 0.5 }
};

const Sounds = {
  ambiance: "sons/ambiance.mp3",
  intro: "sons/intro.mp3",
  victoire: "sons/victoire.mp3",
  defaite: "sons/defaite.mp3",
  enigme: "sons/enigme_reussie.mp3",
  erreur: "sons/erreur.mp3",
  item: "sons/item.mp3",
  indice: "sons/indice.mp3"
};

// === Audio ===
let ambianceAudio = null;
let activeSounds = [];

function playSound(src, volume = 0.3, loop = false) {
  const audio = new Audio(src);
  audio.volume = volume;
  audio.loop = loop;
  audio.play().catch(e => console.warn("AutoPlay bloqué", e));
  activeSounds.push(audio);
  return audio;
}

function playAmbiance() {
  stopAllSounds();
  ambianceAudio = playSound(Sounds.ambiance, Config.volumes.ambiance, true);
}

function stopAmbiance() {
  if (ambianceAudio) {
    ambianceAudio.pause();
    ambianceAudio.currentTime = 0;
    ambianceAudio = null;
  }
}

function stopAllSounds() {
  if (ambianceAudio) stopAmbiance();
  activeSounds.forEach(a => { a.pause(); a.currentTime = 0; });
  activeSounds = [];
}

// === Gestion écrans ===
function switchScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// === Timer ===
let timeLeft = Config.time;
let timerInterval = null;

function startTimer() {
  timeLeft = Config.time;
  updateTimerDisplay();
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  timeLeft--;
  updateTimerDisplay();

  // Accélération de la musique + effets visuels
  if (ambianceAudio) {
    const ratio = timeLeft / Config.time;
    const speed = 1 + (1 - ratio) * (Config.musicMaxSpeed - 1);
    ambianceAudio.playbackRate = speed;
    document.body.classList.toggle("danger", speed > 1.4);
  }

  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    endGame(false);
  }
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById("timer").textContent =
    `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// === Fin du jeu ===
function endGame(victory) {
  clearInterval(timerInterval);
  stopAllSounds();

  const endTitle = document.getElementById("end-title");

  if (victory) {
    playSound(Sounds.victoire, Config.volumes.fin);
    document.body.style.backgroundImage = "url('images/victoire.jpg')";
    endTitle.textContent = "Victoire ! Vous avez sauvé le royaume ✨";
  } else {
    playSound(Sounds.defaite, Config.volumes.fin);
    document.body.style.backgroundImage = "url('images/defaite.jpg')";
    endTitle.textContent = "Défaite... Le royaume est perdu ☠️";
  }

  switchScreen("screen-end");
}

// === Inventaire ===
function addItem(name, img) {
  const inv = document.getElementById("inventory");
  const item = document.createElement("img");
  item.src = img;
  item.alt = name;
  item.title = name;
  item.addEventListener("click", () => {
    playSound(Sounds.item, Config.volumes.effets);
    alert(`${name} examiné !`);
  });
  inv.appendChild(item);
}

// === Events ===
document.getElementById("btn-start").addEventListener("click", () => {
  const pseudo = document.getElementById("pseudo").value.trim();
  if (pseudo.length < 2) return alert("Pseudo trop court !");
  document.getElementById("player").textContent = `Joueur : ${pseudo}`;
  switchScreen("screen-intro");
  playSound(Sounds.intro, 0.4);
});

document.getElementById("btn-play").addEventListener("click", () => {
  switchScreen("screen-game");
  playAmbiance();
  startTimer();

  // Ajout d’objets de départ
  addItem("Clé magique", "images/clé.png");
  addItem("Grimoire ancien", "images/grimoire.png");
  addItem("Fiole mystique", "images/fiole.png");
});

document.getElementById("force-victory").addEventListener("click", () => endGame(true));
document.getElementById("force-defeat").addEventListener("click", () => endGame(false));

document.getElementById("clear-scores").addEventListener("click", () => {
  localStorage.removeItem("scores");
  alert("Scores réinitialisés");
});
