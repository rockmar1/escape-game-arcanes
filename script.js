let pseudo="", temps=0, timer, bonusUtilises=0, pluieActive=null;
const DUREE_TOTALE=1800, DERNIERES_MINUTES=300; // 30min jeu, 5min tension

// === DEMARRAGE ===
function demarrerJeu(){
  pseudo=document.getElementById("pseudoInput").value;
  if(pseudo.trim()===""){alert("Entre ton pseudo !"); return;}
  document.getElementById("pseudoScreen").classList.add("hidden");
  document.getElementById("introScreen").classList.remove("hidden");
  let musique=document.getElementById("musiqueIntro");
  musique.volume=0.3; musique.play();
}

// === LANCEMENT ENIGMES ===
function lancerEnigmes(){
  document.getElementById("introScreen").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");
  document.getElementById("inventaire").classList.remove("hidden");

  // Timer
  timer=setInterval(()=>{ temps++; gererMusiqueFin(); },1000);

  // Musique ambiance
  let musique=document.getElementById("musiqueAmbiance");
  musique.volume=0.2;
  musique.play();
}

// === MUSIQUE DYNAMIQUE ===
function gererMusiqueFin(){
  let musique=document.getElementById("musiqueAmbiance");
  if(temps >= DUREE_TOTALE-DERNIERES_MINUTES){
    musique.playbackRate=1.5; musique.volume=0.3;
  }else{ musique.playbackRate=1; }
}

// === INVENTAIRE & BONUS ===
function ajouterObjetInventaire(img,id,desc){
  let el=document.createElement("img"); el.src="images/"+img; el.id=id; el.title=desc;
  document.getElementById("contenuInventaire").appendChild(el);
}
function ajouterBonus(type){
  let img=document.createElement("img"); img.src="images/"+type+".png"; img.id=type; img.title="Bonus : "+type;
  img.addEventListener("click",()=>utiliserBonus(type));
  document.getElementById("contenuInventaire").appendChild(img);
}
function utiliserBonus(type){
  document.getElementById("sonBonus").play(); bonusUtilises++;
  let enigme=document.querySelector(".enigme:not(.hidden)");
  switch(type){
    case "etoile": temps-=300; alert("⭐ Le sablier gagne 5 minutes !"); break;
    case "fiole": if(enigme){ enigme.remove(); alert("🧪 La fiole résout l'énigme !"); } break;
    case "grimoire": if(enigme){ let indice=enigme.querySelector(".indice"); if(indice) indice.classList.remove("hidden"); alert("📜 Le grimoire révèle un indice !"); } break;
  }
  document.getElementById(type).remove();
}

// === VALIDATION ENIGMES ===
function validerEnigme(num){
  let input=document.getElementById("reponse"+num).value.toLowerCase();
  const sonEnigme=document.getElementById("sonEnigme");
  const sonErreur=document.getElementById("sonErreur");

  if(num===1 && input==="avenir"){
    document.getElementById("enigme1").remove(); sonEnigme.play(); alert("Bravo ! 🎉 Vous avez trouvé la clé !");
    ajouterObjetInventaire("clé.png","clé","Une clé mystérieuse."); montrerEnigme("enigme2");
  }
  else if(num===2 && input==="pas"){
    document.getElementById("enigme2").remove(); sonEnigme.play(); alert("Bonne réponse ! ⭐ Bonus étoile !");
    ajouterBonus("etoile"); montrerEnigme("enigme3");
  }
  else if(num===3 && input==="silence"){
    document.getElementById("enigme3").remove(); clearInterval(timer);
    sonEnigme.play(); effetVictoire(); lancerPluie("etoiles");
    afficherFinNarrative(true,()=>afficherScoreboard(true));
  }
  else{ sonErreur.play(); alert("Mauvaise réponse, essaye encore !"); }
}

// === MONTRE ENIGME AVEC ANIMATION ===
function montrerEnigme(id){ let enigme=document.getElementById(id); enigme.classList.remove("hidden"); setTimeout(()=>enigme.classList.add("show"),50); }

// === PLUIE ===
function lancerPluie(type){
  if(pluieActive) clearInterval(pluieActive);
  pluieActive=setInterval(()=>{
    let elem=document.createElement("div");
    if(type==="etoiles"){ elem.classList.add("star"); elem.innerText=Math.random()>0.5?"✨":"★";
      const colors=["#ffd700","#ff69b4","#00ffff","#ffffff"];
      elem.style.color=colors[Math.floor(Math.random()*colors.length)];
      elem.style.fontSize=10+Math.random()*30+"px";
    } else if(type==="gouttes"){ elem.classList.add("drop"); elem.innerText="💧"; }
    elem.style.left=Math.random()*100+"vw"; elem.style.animationDuration=2+Math.random()*3+"s";
    document.body.appendChild(elem); setTimeout(()=>elem.remove(),6000);
  },150);
}

// === FIN NARRATIVE ===
function afficherFinNarrative(victoire,callback){
  const narr=document.getElementById("narratif"); narr.classList.remove("hidden");
  narr.innerHTML=victoire? "🎉 Vous avez sauvé le royaume ! La joie éclate partout, la magie est rétablie !" 
                         : "😢 Hélas, la malédiction persiste. Le royaume sombre dans la tristesse...";
  setTimeout(()=>{ narr.classList.add("hidden"); callback(); },4000);
}

// === EFFETS VISUELS ===
function effetVictoire(){ document.getElementById("gameScreen").classList.add("hidden"); document.getElementById("inventaire").classList.add("hidden");
  document.body.style.backgroundImage="url('images/victoire.jpg')"; document.body.style.backgroundSize="cover"; document.getElementById("scoreScreen").classList.add("victoire");
  document.getElementById("musiqueVictoire").play(); }
function effetDefaite(){
  document.getElementById("gameScreen").classList.add("shake"); lancerPluie("gouttes");
  document.body.style.backgroundImage="url('images/defaite.jpg')"; document.body.style.backgroundSize="cover"; document.getElementById("musiqueDefaite").play();
  for(let i=0;i<30;i++){ let frag=document.createElement("div"); frag.className="fragment"; frag.style.setProperty("--x",(Math.random()-0.5)*500+"px"); frag.style.setProperty("--y",(Math.random()-0.5)*500+"px"); document.body.appendChild(frag); setTimeout(()=>frag.remove(),1000); }
}

// === SCOREBOARD ===
function afficherScoreboard(victoire){
  document.getElementById("scoreScreen").classList.remove("hidden");
  let ligne=document.createElement("tr");
  ligne.innerHTML=`<td>1</td><td>${pseudo}</td><td>${victoire?"Victoire":"Défaite"}</td><td>${Math.floor(temps/60)} min ${temps%60} s</td><td>${bonusUtilises}</td><td>${Math.max(0,1000-temps+bonusUtilises*50)}</td>`;
  document.getElementById("scoreTableBody").appendChild(ligne);
}

// === REJOUER ===
function rejouer(){ location.reload(); }
