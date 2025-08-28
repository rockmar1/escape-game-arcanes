let pseudo = "";
let temps = 0;
let timer;
let bonusUtilises = 0;
let pluieActive = null;
let tempsMax = 1800; // 30 min

// === DEMARRAGE ===
function demarrerJeu() {
  pseudo = document.getElementById("pseudoInput").value.trim();
  if (!pseudo) return alert("Entre ton pseudo !");
  
  changerEcran("pseudoScreen", "introScreen");

  let musique = document.getElementById("musiqueIntro");
  musique.volume = 0.3;
  musique.play().catch(()=>{});
}

function lancerEnigmes() {
  changerEcran("introScreen", "gameScreen");

  document.getElementById("musiqueIntro").pause();
  let ambiance = document.getElementById("musiqueAmbiance");
  ambiance.volume = 0.2;
  ambiance.play().catch(()=>{});

  // Timer
  timer = setInterval(() => {
    temps++;
    let restant = tempsMax - temps;
    if (restant <=0) {
      clearInterval(timer);
      afficherFin(false);
    }
    document.getElementById("timer").innerText = `Temps restant : ${formatTemps(restant)}`;
    if (restant === 300) ambiance.playbackRate = 1.3;
  },1000);
}

// === Changement écran avec transition ===
function changerEcran(oldId, newId){
  let oldE = document.getElementById(oldId);
  let newE = document.getElementById(newId);
  oldE.classList.add("fade-out");
  setTimeout(()=>{ oldE.classList.add("hidden"); oldE.classList.remove("fade-out"); },800);
  newE.classList.remove("hidden");
  newE.classList.add("fade-in");
  setTimeout(()=>newE.classList.remove("fade-in"),800);
}

// === Inventaire / Bonus ===
function ajouterObjetInventaire(img,id,desc){
  let el=document.createElement("img");
  el.src="images/"+img; el.id=id; el.title=desc;
  document.getElementById("contenuInventaire").appendChild(el);
}
function ajouterBonus(type){
  let img=document.createElement("img");
  img.src="images/"+type+".png"; img.id=type; img.title="Bonus : "+type;
  img.addEventListener("click", ()=>utiliserBonus(type,img));
  document.getElementById("contenuInventaire").appendChild(img);
}
function utiliserBonus(type,img){
  if(img.classList.contains("used")) return;
  document.getElementById("sonBonus").play().catch(()=>{});
  bonusUtilises++;
  let enigmeVisible=document.querySelector(".enigme:not(.hidden)");
  switch(type){
    case "etoile": temps = Math.max(0, temps-300); alert("⭐ Le sablier gagne 5 minutes !"); break;
    case "fiole": if(enigmeVisible){ enigmeVisible.remove(); alert("🧪 La fiole a résolu l’énigme !"); } break;
    case "grimoire": if(enigmeVisible){ let indice = enigmeVisible.querySelector(".indice"); if(indice) indice.classList.remove("hidden"); alert("📜 Le grimoire révèle un indice !"); } break;
  }
  img.classList.add("used");
}

// === Validation énigmes ===
function validerEnigme(num){
  let input=document.getElementById("reponse"+num).value.toLowerCase();
  if((num===1 && input==="avenir") || (num===2 && input==="pas") || (num===3 && input==="silence")){
    document.getElementById("enigme"+num).remove();
    switch(num){
      case 1: alert("Bravo ! 🎉 Vous avez trouvé la clé !"); ajouterObjetInventaire("clé.png","clé","Une clé mystérieuse."); afficherEnigme(2); break;
      case 2: alert("Bonne réponse ! ⭐ Vous gagnez un bonus étoile !"); ajouterBonus("etoile"); afficherEnigme(3); break;
      case 3: clearInterval(timer); afficherFin(true); break;
    }
  } else alert("Mauvaise réponse, essaye encore !");
}

// Affichage énigmes avec transition
function afficherEnigme(num){
  let enigmes = document.querySelectorAll(".enigme");
  enigmes.forEach(e => e.classList.add("hidden"));
  let e=document.getElementById("enigme"+num);
  if(e){ e.classList.remove("hidden"); e.classList.add("fade-in"); setTimeout(()=>e.classList.remove("fade-in"),800);}
}

// === Fin ===
function afficherFin(victoire){
  changerEcran("gameScreen","endScreen");
  document.getElementById("inventaire").classList.add("hidden");

  let img = document.getElementById("endImage");
  let narrative = document.getElementById("finNarrative");

  if(victoire){
    document.getElementById("musiqueAmbiance").pause();
    document.getElementById("musiqueVictoire").play().catch(()=>{});
    img.src="images/victoire.jpg";
    narrative.innerHTML=`
      <h2>Victoire ! ✨</h2>
      <p>Les ténèbres se dissipent et les habitants vous acclament comme de véritables héros.</p>
    `;
    lancerPluie("etoiles"); lancerConfettis();
    ajouterScore("Victoire");
  } else {
    document.getElementById("musiqueAmbiance").pause();
    document.getElementById("musiqueDefaite").play().catch(()=>{});
    img.src="images/defaite.jpg";
    document.body.classList.add("tremble");
    creerBrisure();
    narrative.innerHTML=`
      <h2>Défaite... 💀</h2>
      <p>Le temps est écoulé. Les ombres ont pris possession du Royaume.</p>
    `;
    ajouterScore("Défaite");
  }
}

// === Pluie / Confettis / Brisures ===
function lancerPluie(type){
  if(pluieActive) clearInterval(pluieActive);
  const container=document.getElementById("effectsContainer");
  pluieActive=setInterval(()=>{
    let elem=document.createElement("div");
    elem.style.left=Math.random()*100+"vw";
    elem.style.fontSize=15+Math.random()*20+"px";
    elem.style.animationDuration=3+Math.random()*3+"s";
    if(type==="etoiles"){ elem.className="star"; elem.innerText=Math.random()>0.5?"✨":"★"; elem.style.color=Math.random()>0.5?"#ffd700":"#ff69b4"; }
    container.appendChild(elem);
    setTimeout(()=>elem.remove(),6000);
  },300);
}
function lancerConfettis(){
  const container=document.getElementById("effectsContainer");
  for(let i=0;i<200;i++){
    let frag=document.createElement("div");
    frag.className="confetti";
    frag.innerText="🎉";
    frag.style.top=Math.random()*100+"vh";
    frag.style.left=Math.random()*100+"vw";
    frag.style.fontSize="20px";
    frag.style.opacity=0.8;
    container.appendChild(frag);
    setTimeout(()=>frag.remove(),2000);
  }
}
function creerBrisure(){
  const container=document.getElementById("effectsContainer");
  for(let i=0;i<30;i++){
    let frag=document.createElement("div");
    frag.className="brisure";
    frag.innerText="▯";
    frag.style.top="50%"; frag.style.left="50%";
    frag.style.fontSize="30px";
    frag.style.transform=`translate(${(Math.random()-0.5)*400}px,${(Math.random()-0.5)*400}px)`;
    container.appendChild(frag);
    setTimeout(()=>frag.remove(),1500);
  }
}

// === Score / Rejouer ===
function ajouterScore(resultat){
  let ligne=document.createElement("tr");
  ligne.innerHTML=`
    <td>${pseudo}</td>
    <td>${resultat}</td>
    <td>${formatTemps(temps)}</td>
    <td>${bonusUtilises}</td>
  `;
  document.getElementById("scoreTableBody").appendChild(ligne);
}
function formatTemps(s){ return `${Math.floor(s/60)} min ${s%60} s`; }
function rejouer(){ location.reload(); }
