const volumeFactor = 0.75;

// === Classes ===
class Joueur {
  constructor(pseudo) { this.pseudo=pseudo; this.bonusUtilises=0; this.inventaire=[]; }
  ajouterObjet(obj){ this.inventaire.push(obj); afficherInventaire(); }
  utiliserBonus(type){ this.bonusUtilises++; }
}

class Enigme {
  constructor(id, question, reponses, indice="", bonus=null){
    this.id=id; this.question=question; this.reponses=reponses; this.indice=indice; this.bonus=bonus;
  }
  afficher(){
    const container=document.createElement("div");
    container.classList.add("enigme");
    container.id="enigme"+this.id;
    container.innerHTML=`<h2>Énigme ${this.id}</h2>
      <p>${this.question}</p>
      <input type="text" id="reponse${this.id}">
      <button class="valider" data-id="${this.id}">Valider</button>
      <p class="indice hidden">${this.indice}</p>`;
    document.getElementById("enigmesContainer").appendChild(container);
    container.querySelector(".valider").addEventListener("click",()=>jeu.validerEnigme(this.id));
  }
}

// === Game Manager ===
class GameManager {
  constructor(){
    this.joueur=null; this.temps=0; this.tempsMax=1800; this.timer=null;
    this.enigmes=[]; this.currentEnigme=0;
  }
  demarrer(pseudo){
    this.joueur=new Joueur(pseudo);
    switchScreen("pseudoScreen","introScreen");
    afficherIntroTexte();
    let musique=document.getElementById("musiqueIntro"); musique.volume=0.3*volumeFactor; musique.play().catch(()=>{});
  }
  lancerJeu(){
    switchScreen("introScreen","gameScreen");
    document.getElementById("inventaire").classList.remove("hidden");
    document.getElementById("musiqueIntro").pause();
    let ambiance=document.getElementById("musiqueAmbiance"); ambiance.volume=0.2*volumeFactor; ambiance.play().catch(()=>{});
    this.timer=setInterval(()=>this.updateTimer(),1000);
    this.enigmes[this.currentEnigme].afficher();
  }
  updateTimer(){
    this.temps++;
    let restant=this.tempsMax-this.temps;
    document.getElementById("timer").innerText=`Temps restant : ${formatTemps(restant)}`;
    if(restant<=0){ clearInterval(this.timer); finDefaite(); }
  }
  validerEnigme(id){
    const input=document.getElementById("reponse"+id).value.toLowerCase();
    const enigme=this.enigmes[this.currentEnigme];
    const container=document.getElementById("enigme"+id);
    let oldCross = container.querySelector(".incorrect");
    if(oldCross) oldCross.remove();
    if(enigme.reponses.includes(input)){
      if(enigme.bonus) this.joueur.ajouterObjet(enigme.bonus);
      container.remove();
      this.currentEnigme++;
      if(this.currentEnigme<this.enigmes.length) this.enigmes[this.currentEnigme].afficher();
      else { clearInterval(this.timer); finVictoire(); }
    } else {
      const cross = document.createElement("span");
      cross.classList.add("incorrect");
      cross.textContent="❌";
      container.appendChild(cross);
    }
  }
}

// === Utils ===
function switchScreen(oldId,newId){
  document.getElementById(oldId).classList.add("hidden");
  document.getElementById(newId).classList.remove("hidden");
}

const intros=[
  `Il était une fois, dans un royaume baigné de lumière, une ombre s'étendit et plongea le monde dans un sommeil éternel...`,
  `Le Royaume Oublié dort sous le voile des ténèbres. Seuls des aventuriers courageux pourront lever cette malédiction...`,
  `Dans les terres oubliées, le temps s'est arrêté. La magie ancestrale attend des mains courageuses...`
];

function afficherIntroTexte(){
  const texte=intros[Math.floor(Math.random()*intros.length)];
  const container=document.querySelector("#introScreen .page.droite");
  container.innerHTML='<h2>Chapitre 1 : Le Royaume Oublié</h2><p class="typed-text"></p>';
  const p=container.querySelector("p"); let i=0;
  function typer(){ if(i<texte.length){ p.textContent+=texte[i]; i++; setTimeout(typer,40);} }
  typer();
}

function afficherInventaire(){
  const cont=document.getElementById("contenuInventaire");
  cont.innerHTML="";
  jeu.joueur.inventaire.forEach(obj=>{
    const img=document.createElement("img");
    img.src="images/"+obj+".png"; img.title=obj; cont.appendChild(img);
  });
}

function formatTemps(s){ return `${Math.floor(s/60)} min ${s%60} s`; }

// === Fins multiples ===
function finVictoire(){
  const bonus=jeu.joueur.bonusUtilises; const tempsRestant=jeu.tempsMax-jeu.temps;
  let texte="";
  if(bonus===0 && tempsRestant>900){ texte=`Votre aventure fut parfaite ! Vous n'avez eu besoin d'aucun bonus et vous avez sauvé le royaume rapidement. Les habitants vous acclament comme un héros légendaire.`; }
  else if(bonus>0 && tempsRestant>600){ texte=`Vous avez utilisé quelques aides mais votre courage a triomphé ! Le royaume retrouve peu à peu sa lumière grâce à votre persévérance.`; }
  else { texte=`Malgré la difficulté et les obstacles, vous avez sauvé le Royaume Oublié. Chaque village célèbre vos efforts héroïques.`; }
  afficherFin("victoire",texte);
}

function finDefaite(){
  const texte=`Le temps est écoulé. L'ombre a envahi le royaume et le silence s'étend partout. Les héros devront revenir pour relever le défi.`;
  afficherFin("defaite",texte);
}

function afficherFin(type,texte){
  document.getElementById("gameScreen").classList.add("hidden");
  document.getElementById("inventaire").classList.add("hidden");
  const endScreen=document.getElementById("endScreen"); 
  endScreen.classList.remove("hidden");

  const img=document.getElementById("endImage"); 
  const narrative=document.getElementById("finNarrative");
  narrative.innerHTML='<p class="typed-text"></p>'; 
  const p=narrative.querySelector("p");
  let i=0; 
  function typer(){ 
    if(i<texte.length){ p.textContent+=texte[i]; i++; setTimeout(typer,25); }
    else { document.getElementById("scoreScreen").style.display="block"; }
  }
  typer();

  document.getElementById("scoreScreen").style.display="none";

  if(type==="victoire"){ 
      img.src="images/victoire.jpg"; 
      document.getElementById("musiqueAmbiance").pause(); 
      document.getElementById("musiqueVictoire").volume=1*volumeFactor; 
      document.getElementById("musiqueVictoire").play().catch(()=>{}); 
  }
  else{ 
      img.src="images/defaite.jpg"; 
      document.getElementById("musiqueAmbiance").pause(); 
      document.getElementById("musiqueDefaite").volume=1*volumeFactor; 
      document.getElementById("musiqueDefaite").play().catch(()=>{}); 
      document.body.classList.add("tremble-finite"); 
      setTimeout(()=>document.body.classList.remove("tremble-finite"),5000);
  }
}

// === Initialisation du jeu ===
const jeu=new GameManager();
jeu.enigmes=[
  new Enigme(1,"Je suis toujours devant toi mais tu ne peux jamais m’atteindre.",["avenir","futur"],"Indice : tu peux toujours essayer de courir après…","clé"),
  new Enigme(2,"Plus tu en prends, plus tu en laisses derrière toi.",["pas","empreinte"],"Indice : regarde bien le sol après une promenade…","etoile"),
  new Enigme(3,"On me casse mais je ne tombe jamais.",["silence"],"Indice : cela arrive souvent dans une conversation…","grimoire")
];

// === Boutons ===
document.getElementById("startButton").addEventListener("click",()=>{
  const pseudo=document.getElementById("pseudoInput").value.trim();
  if(!pseudo){ alert("Entre ton pseudo !"); return; }
  jeu.demarrer(pseudo);
});
document.getElementById("enterGame").addEventListener("click",()=>jeu.lancerJeu());
document.getElementById("replayButton").addEventListener("click",()=>location.reload());

// --- Boutons debug ---
const debugDiv=document.createElement("div");
debugDiv.style.position="fixed"; debugDiv.style.bottom="10px"; debugDiv.style.right="10px"; debugDiv.style.zIndex=1000;
debugDiv.innerHTML=`<button id="testVictoire">Tester Victoire</button>
<button id="testDefaite">Tester Défaite</button>`;
document.body.appendChild(debugDiv);
document.getElementById("testVictoire").addEventListener("click",()=>finVictoire());
document.getElementById("testDefaite").addEventListener("click",()=>finDefaite());
