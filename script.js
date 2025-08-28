let Game = { pseudo:"", temps:0, tempsMax:1800, timer:null, bonusUtilises:0, pluieActive:null };
const volumeFactor = 0.75;

// Chemins alternatifs / mini-quêtes
const enigmesData = {
  1: [{ answer:"avenir", message:"Bravo ! 🎉 Vous avez trouvé la clé !" },
      { answer:"futur", message:"Vous trouvez un ancien parchemin caché !", bonus:"grimoire" }],
  2: [{ answer:"pas", message:"Bonne réponse ! ⭐ Vous gagnez un bonus étoile !", bonus:"etoile" },
      { answer:"empreinte", message:"Vous découvrez une fiole magique !", bonus:"fiole" }],
  3: [{ answer:"silence", message:"Vous avez terminé l'aventure !" }]
};

// --- INTRO effet plume ---
function afficherIntroTexte(){
  const texte = `Il était une fois, dans un royaume baigné de lumière, une ombre
s’étendit et plongea le monde dans un sommeil éternel. Seuls des aventuriers
courageux pourront lever cette malédiction en résolvant des énigmes et en
découvrant les artefacts magiques. Le temps vous est compté…`;
  const container = document.querySelector("#introScreen .page.droite");
  container.innerHTML='<h2>Chapitre 1 : Le Royaume Oublié</h2><p class="typed-text"></p>';
  const p=container.querySelector("p.typed-text");
  let i=0;
  function typer(){ if(i<texte.length){ p.textContent+=texte[i]; i++; setTimeout(typer,40); } }
  typer();
}

// --- Gestion écrans ---
function changerEcran(oldId,newId){
  let oldE=document.getElementById(oldId),newE=document.getElementById(newId);
  oldE.classList.add("fade-out");
  setTimeout(()=>{ oldE.classList.add("hidden"); oldE.classList.remove("fade-out"); },800);
  newE.classList.remove("hidden"); newE.classList.add("fade-in");
  setTimeout(()=>newE.classList.remove("fade-in"),800);
}

// --- Démarrage ---
document.getElementById("startButton").addEventListener("click",()=>{
  Game.pseudo=document.getElementById("pseudoInput").value.trim();
  if(!Game.pseudo)return alert("Entre ton pseudo !");
  changerEcran("pseudoScreen","introScreen");
  afficherIntroTexte();
  let musique=document.getElementById("musiqueIntro"); musique.volume=0.3*volumeFactor; musique.play().catch(()=>{});
});
document.getElementById("enterGame").addEventListener("click",lancerEnigmes);
document.getElementById("replayButton").addEventListener("click",()=>location.reload());
document.getElementById("testDefaite").addEventListener("click",()=>afficherFin(false));
document.querySelectorAll(".valider").forEach(btn=>btn.addEventListener("click",()=>validerEnigme(btn.dataset.enigme)));

// --- Enigmes ---
function lancerEnigmes(){
  changerEcran("introScreen","gameScreen");
  document.getElementById("musiqueIntro").pause();
  let ambiance=document.getElementById("musiqueAmbiance"); ambiance.volume=0.2*volumeFactor; ambiance.play().catch(()=>{});
  Game.timer=setInterval(()=>{
    Game.temps++; let restant=Game.tempsMax-Game.temps;
    if(restant<=0){ clearInterval(Game.timer); afficherFin(false); }
    document.getElementById("timer").innerText=`Temps restant : ${formatTemps(restant)}`;
    if(restant===300) ambiance.playbackRate=1.3;
  },1000);
}

function validerEnigme(num){
  let input=document.getElementById("reponse"+num).value.toLowerCase();
  let trouve=false;
  enigmesData[num].forEach(rep=>{
    if(input===rep.answer.toLowerCase()){
      trouve=true;
      alert(rep.message);
      if(rep.bonus) ajouterBonus(rep.bonus);
      document.getElementById("enigme"+num).remove();
      if(num<3) afficherEnigme(parseInt(num)+1);
      else { clearInterval(Game.timer); afficherFin(true); }
    }
  });
  if(!trouve) alert("Mauvaise réponse, essaye encore !");
}

function afficherEnigme(num){
  document.querySelectorAll(".enigme").forEach(e=>e.classList.add("hidden"));
  let e=document.getElementById("enigme"+num);
  if(e){ e.classList.remove("hidden"); e.classList.add("fade-in"); setTimeout(()=>e.classList.remove("fade-in"),800);}
}

// --- Inventaire / bonus ---
function ajouterObjetInventaire(img,id,desc){
  let el=document.createElement("img"); el.src="images/"+img; el.id=id; el.title=desc;
  document.getElementById("contenuInventaire").appendChild(el);
}

function ajouterBonus(type){
  let img=document.createElement("img"); img.src="images/"+type+".png"; img.id=type; img.title="Bonus : "+type;
  img.addEventListener("click",()=>utiliserBonus(type,img));
  document.getElementById("contenuInventaire").appendChild(img);
}

function utiliserBonus(type,img){
  if(img.classList.contains("used"))return;
  document.getElementById("sonBonus").volume=1*volumeFactor; document.getElementById("sonBonus").play().catch(()=>{});
  Game.bonusUtilises++;
  let enigmeVisible=document.querySelector(".enigme:not(.hidden)");
  switch(type){
    case "etoile": Game.temps=Math.max(0,Game.temps-300); alert("⭐ Le sablier gagne 5 minutes !"); break;
    case "fiole": if(enigmeVisible){ enigmeVisible.remove(); alert("🧪 La fiole a résolu l’énigme !"); } break;
    case "grimoire": if(enigmeVisible){ let indice=enigmeVisible.querySelector(".indice"); if(indice) indice.classList.remove("hidden"); alert("📜 Le grimoire révèle un indice !"); } break;
  }
  img.classList.add("used");
}

// --- Fin / effets ---
function afficherFin(victoire){
  document.getElementById("gameScreen").classList.add("hidden");
  document.getElementById("inventaire").classList.add("hidden");
  document.getElementById("endScreen").classList.remove("hidden");
  let img=document.getElementById("endImage"), narrative=document.getElementById("finNarrative");
  clearInterval(Game.timer);
  if(victoire){
    document.getElementById("musiqueAmbiance").pause(); document.getElementById("musiqueVictoire").volume=1*volumeFactor; document.getElementById("musiqueVictoire").play().catch(()=>{});
    img.src="images/victoire.jpg";
    narrative.innerHTML=`<h2>Victoire ! ✨</h2><p>Les ténèbres se dissipent peu à peu, et la lumière du royaume éclaire chaque château et forêt. Les habitants vous acclament comme de véritables héros, et la magie ancienne renaît. Votre courage et votre sagesse ont brisé la malédiction.</p>`;
    lancerPluie("etoiles"); lancerConfettis(); ajouterScore("Victoire");
  }else{
    document.getElementById("musiqueAmbiance").pause(); document.getElementById("musiqueDefaite").volume=1*volumeFactor; document.getElementById("musiqueDefaite").play().catch(()=>{});
    img.src="images/defaite.jpg";
    document.body.classList.add("tremble-finite");
    creerBrisure();
    setTimeout(()=>document.body.classList.remove("tremble-finite"),5000);
    narrative.innerHTML=`<h2>Défaite... 💀</h2><p>Le temps est écoulé. L’ombre s’est étendue sur le Royaume Oublié, étouffant la lumière et plongeant les terres dans le silence. Les anciens grimoires pleurent votre absence, et le royaume attend un autre héros pour relever le défi.</p>`;
    ajouterScore("Défaite");
  }
}

// --- Pluie / confettis / brisure ---
function lancerPluie(type){ if(Game.pluieActive) clearInterval(Game.pluieActive);
  Game.pluieActive=setInterval(()=>{
    let elem=document.createElement("div");
    if(type==="etoiles"){ elem.classList.add("star"); elem.innerText=Math.random()>0.5?"✨":"★"; elem.style.color=Math.random()>0.5?"#ffd700":"#ff69b4"; }
    elem.style.left=Math.random()*100+"vw"; elem.style.top="-20px";
    elem.style.fontSize=15+Math.random()*20+"px"; elem.style.animationDuration=3+Math.random()*3+"s";
    document.getElementById("effectsContainer").appendChild(elem);
    setTimeout(()=>elem.remove(),6000);
  },300);
}

function lancerConfettis(){
  for(let i=0;i<200;i++){
    let frag=document.createElement("div"); frag.classList.add("confetti"); frag.innerText="🎉";
    frag.style.top=Math.random()*100+"vh"; frag.style.left=Math.random()*100+"vw"; frag.style.fontSize="20px"; frag.style.opacity=0.8;
    document.getElementById("effectsContainer").appendChild(frag); setTimeout(()=>frag.remove(),2000);
  }
}

function creerBrisure(){
  for(let i=0;i<30;i++){
    let frag=document.createElement("div"); frag.classList.add("brisure"); frag.innerText="▯";
    frag.style.top="50%"; frag.style.left="50%"; frag.style.fontSize="30px";
    frag.style.transform=`translate(${(Math.random()-0.5)*400}px,${(Math.random()-0.5)*400}px)`;
    document.getElementById("effectsContainer").appendChild(frag); setTimeout(()=>frag.remove(),1500);
  }
}

// --- Scores ---
function ajouterScore(resultat){
  let ligne=document.createElement("tr");
  ligne.innerHTML=`<td>${Game.pseudo}</td><td>${resultat}</td><td>${formatTemps(Game.temps)}</td><td>${Game.bonusUtilises}</td>`;
  document.getElementById("scoreTableBody").appendChild(ligne);
}

function formatTemps(s){ return `${Math.floor(s/60)} min ${s%60} s`; }
