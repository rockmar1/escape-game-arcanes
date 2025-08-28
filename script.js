let pseudo = "";
let temps = 0;
let timer;
let bonusUtilises = 0;
let pluieActive = null;

// === DEMARRAGE ===
function demarrerJeu() {
  pseudo = document.getElementById("pseudoInput").value;
  if (pseudo.trim() === "") {
    alert("Entre ton pseudo !");
    return;
  }

  document.getElementById("pseudoScreen").classList.add("hidden");
  document.getElementById("introScreen").classList.remove("hidden");

  let musique = document.getElementById("musiqueIntro");
  musique.volume = 0.3;
  musique.play();
}

function lancerEnigmes() {
  document.getElementById("introScreen").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");
  document.getElementById("inventaire").classList.remove("hidden");

  document.getElementById("musiqueIntro").pause();
  let ambiance = document.getElementById("musiqueAmbiance");
  ambiance.volume = 0.2;
  ambiance.play();

  timer = setInterval(() => {
    temps++;
    let restant = 60 - temps;
    if (restant === 30) {
      ambiance.playbackRate = 1.3;
    }
  }, 1000);
}

// === INVENTAIRE ===
function ajouterObjetInventaire(img, id, description) {
  let el = document.createElement("img");
  el.src = "images/" + img;
  el.id = id;
  el.title = description;
  document.getElementById("contenuInventaire").appendChild(el);
}
function ajouterBonus(type) {
  let img = document.createElement("img");
  img.src = "images/" + type + ".png";
  img.id = type;
  img.title = "Bonus : " + type;
  img.addEventListener("click", () => utiliserBonus(type));
  document.getElementById("contenuInventaire").appendChild(img);
}
function utiliserBonus(type) {
  document.getElementById("sonBonus").play();
  bonusUtilises++;
  let enigmeVisible = document.querySelector(".enigme:not(.hidden)");
  switch (type) {
    case "etoile":
      temps -= 300;
      alert("⭐ Le sablier gagne 5 minutes !");
      break;
    case "fiole":
      if (enigmeVisible) {
        enigmeVisible.remove();
        alert("🧪 La fiole a résolu l’énigme automatiquement !");
      }
      break;
    case "grimoire":
      if (enigmeVisible) {
        let indice = enigmeVisible.querySelector(".indice");
        if (indice) indice.classList.remove("hidden");
        alert("📜 Le grimoire révèle un indice !");
      }
      break;
  }
  document.getElementById(type).remove();
}

// === VALIDATION ENIGMES ===
function validerEnigme(num) {
  let input = document.getElementById("reponse" + num).value.toLowerCase();

  if (num === 1 && input === "avenir") {
    document.getElementById("enigme1").remove();
    alert("Bravo ! 🎉 Vous avez trouvé la clé !");
    ajouterObjetInventaire("clé.png", "clé", "Une clé mystérieuse.");
    document.getElementById("enigme2").classList.remove("hidden");
  }
  else if (num === 2 && input === "pas") {
    document.getElementById("enigme2").remove();
    alert("Bonne réponse ! ⭐ Vous gagnez un bonus étoile !");
    ajouterBonus("etoile");
    document.getElementById("enigme3").classList.remove("hidden");
  }
  else if (num === 3 && input === "silence") {
    document.getElementById("enigme3").remove();
    clearInterval(timer);
    afficherFin(true);
  }
  else {
    alert("Mauvaise réponse, essaye encore !");
  }
}

// === FIN ===
function afficherFin(victoire) {
  document.getElementById("gameScreen").classList.add("hidden");
  document.getElementById("inventaire").classList.add("hidden");
  document.getElementById("endScreen").classList.remove("hidden");

  let img = document.getElementById("endImage");
  let narrative = document.getElementById("finNarrative");

  if (victoire) {
    document.getElementById("musiqueAmbiance").pause();
    document.getElementById("musiqueVictoire").play();
    img.src = "images/victoire.jpg";
    narrative.innerHTML = `
      <h2>Victoire ! ✨</h2>
      <p>Les ténèbres se dissipent, les chants résonnent dans le royaume et les
      habitants vous acclament comme de véritables héros. Vous avez brisé la
      malédiction et rendu la lumière au Royaume Oublié.</p>
    `;
    lancerPluie("etoiles");
    lancerConfettis();
    ajouterScore("Victoire");
  } else {
    document.getElementById("musiqueAmbiance").pause();
    document.getElementById("musiqueDefaite").play();
    img.src = "images/defaite.jpg";
    document.body.classList.add("tremble");
    creerBrisure();
    narrative.innerHTML = `
      <h2>Défaite... 💀</h2>
      <p>Le temps est écoulé. Les ombres ont pris possession du Royaume. Le
      silence règne désormais, lourd et éternel...</p>
    `;
    ajouterScore("Défaite");
  }
}

// === PLUIE / CONFETTIS ===
function lancerPluie(type) {
  if (pluieActive) clearInterval(pluieActive);
  pluieActive = setInterval(() => {
    let elem = document.createElement("div");
    if (type === "etoiles") {
      elem.classList.add("star");
      elem.innerText = Math.random()>0.5 ? "✨" : "★";
      elem.style.color = Math.random()>0.5 ? "#ffd700" : "#ff69b4";
    }
    elem.style.left = Math.random()*100+"vw";
    elem.style.fontSize = 15+Math.random()*20+"px";
    elem.style.animationDuration = 3+Math.random()*3+"s";
    document.body.appendChild(elem);
    setTimeout(()=>elem.remove(),6000);
  },300);
}
function lancerConfettis(){
  for(let i=0;i<200;i++){
    let frag=document.createElement("div");
    frag.innerText="🎉";
    frag.style.position="fixed";
    frag.style.top=Math.random()*100+"vh";
    frag.style.left=Math.random()*100+"vw";
    frag.style.fontSize="20px";
    frag.style.opacity=0.8;
    document.body.appendChild(frag);
    setTimeout(()=>frag.remove(),2000);
  }
}
function creerBrisure(){
  for(let i=0;i<30;i++){
    let frag=document.createElement("div");
    frag.innerText="▯";
    frag.style.position="fixed";
    frag.style.top="50%";
    frag.style.left="50%";
    frag.style.fontSize="30px";
    frag.style.transform=`translate(${(Math.random()-0.5)*400}px,${(Math.random()-0.5)*400}px)`;
    document.body.appendChild(frag);
    setTimeout(()=>frag.remove(),1500);
  }
}

// === SCORE ===
function ajouterScore(resultat){
  let ligne = document.createElement("tr");
  ligne.innerHTML = `
    <td>${pseudo}</td>
    <td>${resultat}</td>
    <td>${formatTemps(temps)}</td>
    <td>${bonusUtilises}</td>
  `;
  document.getElementById("scoreTableBody").appendChild(ligne);
}
function formatTemps(s){ return `${Math.floor(s/60)} min ${s%60} s`; }
function rejouer(){ location.reload(); }
