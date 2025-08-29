let pseudo = "";
let intros = [
  "Bienvenue {pseudo}, ton aventure commence dans un royaume oublié...",
  "{pseudo}, les anciens t’attendaient depuis longtemps.",
  "Un souffle de vent glacé accompagne ton arrivée, {pseudo}.",
];

function startIntro() {
  pseudo = document.getElementById("pseudoInput").value.trim();

  if (!pseudo) {
    debug("⚠️ Aucun pseudo renseigné !");
    return;
  }

  let screenPseudo = document.getElementById("screen-pseudo");
  let screenIntro = document.getElementById("screen-intro");

  if (!screenPseudo || !screenIntro) {
    debug("❌ Impossible de trouver les écrans 'screen-pseudo' ou 'screen-intro'. Vérifie ton HTML.");
    return;
  }

  // Masquer pseudo, afficher intro
  screenPseudo.classList.add("hidden");
  screenIntro.classList.remove("hidden");

  // Intro personnalisée
  let intro = intros[Math.floor(Math.random() * intros.length)].replace("{pseudo}", pseudo);

  typeWriter(intro, "introText", () => {
    let btnStart = document.getElementById("btnStart");
    if (!btnStart) {
      debug("❌ Le bouton 'btnStart' est manquant dans le HTML.");
      return;
    }
    btnStart.classList.remove("hidden");
  });
}

function startGame() {
  document.getElementById("screen-intro").classList.add("hidden");
  document.getElementById("screen-game").classList.remove("hidden");
  document.getElementById("inventory").classList.remove("hidden");
}

function restartGame() {
  document.getElementById("screen-end").classList.add("hidden");
  document.getElementById("screen-pseudo").classList.remove("hidden");
  document.getElementById("pseudoInput").value = "";
}

// Effet plume (écriture progressive)
function typeWriter(text, elementId, callback) {
  let i = 0;
  let el = document.getElementById(elementId);
  el.innerHTML = "";
  let speed = 40;

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

// DEBUG rouge en haut de la page
function debug(message) {
  let debugBox = document.getElementById("debugBox");

  if (!debugBox) {
    debugBox = document.createElement("div");
    debugBox.id = "debugBox";
    debugBox.style.position = "fixed";
    debugBox.style.top = "10px";
    debugBox.style.left = "50%";
    debugBox.style.transform = "translateX(-50%)";
    debugBox.style.background = "rgba(150,0,0,0.9)";
    debugBox.style.color = "white";
    debugBox.style.padding = "10px 20px";
    debugBox.style.fontSize = "16px";
    debugBox.style.fontFamily = "monospace";
    debugBox.style.borderRadius = "6px";
    debugBox.style.zIndex = "9999";
    debugBox.style.maxWidth = "90%";
    debugBox.style.textAlign = "center";
    document.body.appendChild(debugBox);
  }

  debugBox.textContent = message;

  setTimeout(() => {
    if (debugBox) debugBox.remove();
  }, 6000);
}
