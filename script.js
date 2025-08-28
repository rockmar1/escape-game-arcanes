let pseudo = "", temps=0, timer, bonusUtilises=0, pluieActive=null;

// === DEMARRAGE ===
function demarrerJeu() {
  pseudo=document.getElementById("pseudoInput").value;
  if(pseudo.trim()===""){alert("Entre ton pseudo !");return;}
  document.getElementById("pseudoScreen").classList.add("hidden");
  document.getElementById("introScreen").classList.remove("hidden");
  let musique=document.getElementById("musiqueIntro");
  musique.volume=0.3; musique.play();
}

function lancerEnigmes() {
  document.getElementById("introScreen").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");
  document.getElementById("inventaire").classList.remove("hidden");
  timer=setInterval(()=>temps++,1000);
}

// === INVENTAIRE ===
function ajouterObjetInventaire(img,id,desc){
  let el=document.createElement("img");
  el.src="images/"+img; el.id=id; el.title=desc;
  document.getElementById("contenuInventaire").appendChild(el);
}
function ajouterBonus(type){
  let img=document.createElement("img");
  img.src="images/"+type+".png"; img.id=type; img.title="Bonus : "+type;
  img.addEventListener("click",()=>utiliserBonus(type));
  document.getElementById("contenuInventaire").appendChild(img);
}
function utiliserBonus(type){
  document.getElementById("sonBonus").play();
  bonusUtilises++;
  let enigmeActive=document.querySelector(".enigme:not(.hidden)");
  switch(type){
    case "etoile": temps-=300; alert("⭐ Le sablier gagne 5 minutes !"); break;
    case "fiole": if(enigmeActive){enigmeActive.remove(); alert("🧪 La fiole a résolu l’énigme automatiquement !");} break;
    case "grimoire": if(enigmeActive){let indice=enigmeActive.querySelector(".indice"); if(indice) indice.classList.remove("hidden"); alert("📜 Le grimoire révèle un indice !");} break;
  }
  document.getElementById(type).remove();
}

// === VALIDATION ENIGMES ===
function validerEnigme(num){
  let input=document.getElementById("reponse"+num).value.toLowerCase();
  if(num===1 && input==="avenir"){document.getElementById("enigme1").remove(); alert("Bravo ! 🎉 Vous avez trouvé la clé !"); ajouterObjetInventaire("clé.png","clé","Une clé mystérieuse."); document.getElementById("enigme2").classList.remove("hidden");}
  else if(num===2 && input==="pas"){document.getElementById("enigme2").remove(); alert("Bonne réponse ! ⭐ Vous gagnez un bonus étoile !"); ajouterBonus("etoile"); document.getElementById("enigme3").classList.remove("hidden");}
  else if(num===3){
    clearInterval(timer);
    jouerMusiqueResultat(true);
    lancerPluie("etoiles");
    afficherFinNarrative(true,()=>{afficherScoreboard(true);});
  } else { alert("Mauvaise réponse, essaye encore !"); }
}

// === MUSIQUE ===
function jouerMusiqueResultat(victoire){
  ["musiqueIntro","musiqueVictoire","musiqueDefaite"].forEach(id=>{let m=document.getElementById(id); m.pause(); m.currentTime=0; });
  if(victoire){let m=document.getElementById("musiqueVictoire"); m.volume=0.5; m.play();}
  else{let m=document.getElementById("musiqueDefaite"); m.volume=0.5; m.play();}
}

// === FIN NARRATIVE ===
function afficherFinNarrative(victoire,callback){
  const narratif=document.getElementById("narratif"); narratif.classList.remove("hidden");
  if(victoire){
    narratif.innerHTML=`<h2>Félicitations, ${pseudo} ! 🎉</h2><p>Le royaume est libéré de l’ombre. Les habitants dansent et célèbrent ton courage et ton intelligence.</p>`;
  }else{
    narratif.innerHTML=`<h2>Hélas, ${pseudo}… 😢</h2><p>Le royaume reste plongé dans l’ombre. Le château tremble et l’écran semble se briser sous le poids de la défaite.</p>`;
  }
  setTimeout(()=>{
    narratif.classList.add("hidden");
    if(victoire) effetVictoire();
    else effetDefaite();
    callback();
  },5000);
}

// === SCOREBOARD ===
function calculerScore(victoire){if(!victoire)return 0; let base=1000,penaliteTemps=temps,penaliteBonus=bonusUtilises*50; return Math.max(0,base-penaliteTemps-penaliteBonus);}
function afficherScoreboard(victoire){
  document.getElementById("gameScreen").classList.add("hidden");
  document.getElementById("inventaire").classList.add("hidden");
  let scoreScreen=document.getElementById("scoreScreen"); scoreScreen.classList.remove("hidden");
  scoreScreen.style.animation="none"; void scoreScreen.offsetWidth; scoreScreen.style.animation="showPodium 1s forwards";

  // Changer image
  let decor=document.getElementById("decor");
  decor.src=victoire?"images/victoire.jpg":"images/defaite.jpg"; decor.classList.remove("hidden");

  if(!victoire) lancerPluie("gouttes");

  let resultat=victoire?"Victoire":"Échec";
  let scoreFinal=calculerScore(victoire);
  let ligne={pseudo,resultat,temps:formatTemps(temps),bonus:bonusUtilises,score:scoreFinal};
  let scores=JSON.parse(localStorage.getItem("scores"))||[];
  scores.push(ligne); scores.sort((a,b)=>b.score-a.score);
  localStorage.setItem("scores",JSON.stringify(scores));
  afficherTableauScores();
}

// === TABLEAU ===
function afficherTableauScores(){
  let scores=JSON.parse(localStorage.getItem("scores"))||[];
  let body=document.getElementById("scoreTableBody"); body.innerHTML="";
  scores.forEach((s,index)=>{
    let tr=document.createElement("tr"); let rang,indexClass;
    if(index===0){rang="🥇"; tr.classList.add("gold");}
    else if(index===1){rang="🥈"; tr.classList.add("silver");}
    else if(index===2){rang="🥉"; tr.classList.add("bronze");}
    else rang=index+1;
    tr.innerHTML=`<td>${rang}</td><td>${s.pseudo}</td><td>${s.resultat}</td><td>${s.temps}</td><td>${s.bonus}</td><td>${s.score}</td>`;
    body.appendChild(tr);
  });
}

// === EFFETS ===
function effetVictoire(){document.getElementById("scoreScreen").classList.add("victoire");}
function effetDefaite(){
  document.body.classList.add("shake"); setTimeout(()=>document.body.classList.remove("shake"),500);
  for(let i=0;i<30;i++){
    let frag=document.createElement("div"); frag.classList.add("fragment");
    frag.style.setProperty('--x',`${(Math.random()-0.5)*500}px`);
    frag.style.setProperty('--y',`${(Math.random()-0.5)*500}px`);
    document.body.appendChild(frag);
    setTimeout(()=>frag.remove(),1000);
  }
}

// === PLUIE CONTINUE ===
function lancerPluie(type){
  if(pluieActive) clearInterval(pluieActive);
  pluieActive=setInterval(()=>{
    let elem=document.createElement("div");
    if(type==="etoiles"){elem.classList.add("star"); elem.innerText=Math.random()>0.5?"✨":"★"; elem.style.color=Math.random()>0.5?"#ffd700":"#ff69b4";}
    else if(type==="gouttes"){elem.classList.add("drop"); elem.innerText="💧";}
    elem.style.left=Math.random()*100+"vw"; elem.style.fontSize=15+Math.random()*20+"px"; elem.style.animationDuration=3+Math.random()*3+"s";
    document.body.appendChild(elem); setTimeout(()=>elem.remove(),6000);
  },300);
}

// === UTILS ===
function formatTemps(s){return `${Math.floor(s/60)} min ${s%60} s`;}

// === REJOUER ===
function rejouer(){
  location.reload();
}
