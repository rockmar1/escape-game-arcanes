const volumeFactor = 0.75;

// === Classes ===
class Joueur {
  constructor(pseudo) {
    this.pseudo = pseudo;
    this.bonusUtilises = 0;
    this.inventaire = [];
  }
  ajouterObjet(obj) { this.inventaire.push(obj); afficherInventaire(); }
  utiliserBonus(type) { this.bonusUtilises++; }
}

class Enigme {
  constructor(id, question, reponses, indice="", bonus=null) {
    this.id = id;
    this.question = question;
    this.reponses = reponses; // array de réponses valides
    this.indice = indice;
    this.bonus = bonus; // bonus à donner si trouvé
  }
  afficher() {
    const container = document.createElement("div");
    container.classList.add("enigme");
    container.id = "enigme"+this.id;
    container.innerHTML = `<h2>Énigme ${this.id}</h2>
      <p>${this.question}</p>
      <input type="text" id="reponse${this.id}">
      <button class="valider" data-id="${this.id}">Valider</button>
      <p class="indice hidden">${this.indice}</p>`;
    document.getElementById("enigmesContainer").appendChild(container);
    container.querySelector(".valider").addEventListener("click",()=>jeu.validerEnigme(this.id));
  }
}

// === Gestion du jeu ===
class GameManager {
  constructor() {
    this.joueur = null;
    this.temps = 0;
    this.tempsMax = 1800;
    this.timer = null;
    this.enigmes = [];
    this.currentEnigme = 0;
  }

  demarrer(pseudo){
    this.joueur = new Joueur(pseudo);
    switchScreen("pseudoScreen","introScreen");
    afficherIntroTexte();
    let musique=document.getElementById("musiqueIntro"); musique.volume=0.3*volumeFactor; musique.play().catch(()=>{});
  }

  lancerJeu(){
    switchScreen("introScreen","gameScreen");
    document.getElementById("musiqueIntro").pause();
    let ambiance=document.getElementById("musiqueAmbiance"); ambiance.volume=0.2*volumeFactor; ambiance.play().catch(()=>{});
    this.timer = setInterval(()=>this.updateTimer(),1000);
    this.enigmes[this.currentEnigme].afficher();
  }

  updateTimer(){
    this.temps++;
    let restant = this.tempsMax - this.temps;
    document.getElementById("timer").innerText = `Temps restant : ${formatTemps(restant)}`;
    if(restant<=0){ clearInterval(this.timer); this.fin(false); }
  }

  validerEnigme(id){
    const input = document.getElementById("reponse"+id).value.toLowerCase();
    const enigme = this.enigmes[this.currentEnigme];
    if(enigme.reponses.includes(input)){
      alert("Bonne réponse !");
      if(enigme.bonus) this.joueur.ajouterObjet(enigme.bonus);
      document.getElementById("enigme"+id).remove();
      this.currentEnigme++;
      if(this.currentEnigme < this.enigmes.length) this.enigmes[this.currentEnigme].afficher();
      else { clearInterval(this.timer); this.fin(true); }
    }else{ alert("Mauvaise réponse, essaye encore !"); }
  }

  fin(victoire){
    document.getElementById("gameScreen").classList.add("hidden");
    document.getElementById("inventaire").classList.add("hidden");
    const endScreen = document.getElementById("endScreen");
    endScreen.classList.remove("hidden");
    const img = document.getElementById("endImage");
    const narrative = document.getElementById("finNarrative");

    if(victoire){
      document.getElementById("musiqueAmbiance").pause();
      document.getElementById("musiqueVictoire").volume=1*volumeFactor;
      document.getElementById("musiqueVictoire").play().catch(()=>{});
      img.src="images/victoire.jpg";
      narrative.innerHTML=`<h2>Victoire ! ✨</h2><p>Le royaume est illuminé, les habitants acclament votre bravoure et la magie renaît. Vous êtes un véritable héros !</p>`;
      lancerPluie("etoiles"); lancerConfettis(); ajouterScore("Victoire",this);
    }else{
      document.getElementById("musiqueAmbiance").pause();
      document.getElementById("musiqueDefaite").volume=1*volumeFactor;
      document.getElementById("musiqueDefaite").play().catch(()=>{});
      img.src="images/defaite.jpg";
      document.body.classList.add("tremble-finite");
      setTimeout(()=>document.body.classList.remove("tremble-finite"),5000);
      narrative.innerHTML=`<h2>Défaite... 💀</h2><p>L’ombre s’étend sur le royaume et le silence règne. Les héros devront revenir pour relever le défi.</p>`;
      ajouterScore("Défaite",this);
    }
  }
}

// === Utilitaires ===
function switchScreen(oldId,newId){
  document.getElementById(oldId).classList.add("hidden");
  document.getElementById(newId).classList.remove("hidden");
}

function afficherIntroTexte(){
  const texte = `Il était une fois, dans un royaume baigné de lumière, une ombre
s’étendit et plongea le monde dans le sommeil éternel. Seuls des aventuriers courageux pourront lever cette malédiction en résolvant des énigmes et en découvrant les artefacts magiques. Le temps vous est compté…`;
  const container = document.querySelector("#introScreen .page.droite");
  container.innerHTML='<h2>Chapitre 1 : Le Royaume Oublié</h2><p class="typed-text"></p>';
  const p = container.querySelector("p");
  let i=0;
  function typer(){ if(i<texte.length){ p.textContent+=texte[i]; i++; setTimeout(typer,40);} }
  typer();
}

function afficherInventaire(){
  const cont = document.getElementById("contenuInventaire");
  cont.innerHTML="";
  jeu.joueur.inventaire.forEach(obj=>{
    const img = document.createElement("img");
    img.src="images/"+obj+".png"; img.title=obj; cont.appendChild(img);
  });
}

function ajouterScore(resultat,game){
  const ligne = document.createElement("tr");
  ligne.innerHTML=`<td>${game.joueur.pseudo}</td><td>${resultat}</td><td>${formatTemps(game.temps)}</td><td>${game.joueur.bonusUtilises}</td>`;
  document.getElementById("scoreTableBody").appendChild(ligne);
}

function formatTemps(s){ return `${Math.floor(s/60)} min ${s%60} s`; }

// === Effets visuels simplifiés ===
function lancerPluie(type){ /* similaire à version précédente */ }
function lancerConfettis(){ /* similaire à version précédente */ }

// === Initialisation du jeu et énigmes ===
const jeu = new GameManager();
jeu.enigmes = [
  new Enigme(1,"Je suis toujours devant toi mais tu ne peux jamais m’atteindre.",["avenir","futur"],"Indice : tu peux toujours essayer de courir après…","clé"),
  new Enigme(2,"Plus tu en prends, plus tu en laisses derrière toi.",["pas","empreinte"],"Indice : regarde bien le sol après une promenade…","etoile"),
  new Enigme(3,"On me casse mais je ne tombe jamais.",["silence"],"Indice : cela arrive souvent dans une conversation…","grimoire")
];

// === Boutons ===
document.getElementById("startButton").addEventListener("click",()=>{
  const pseudo = document.getElementById("pseudoInput").value.trim();
  if(!pseudo){ alert("Entre ton pseudo !"); return; }
  jeu.demarrer(pseudo);
});
document.getElementById("enterGame").addEventListener("click",()=>jeu.lancerJeu());
document.getElementById("replayButton").addEventListener("click",()=>location.reload());
