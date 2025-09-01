import { dlog, dwarn } from "./debug.js";

let ambience = null;
let stress = false;

export function initAudioOnUserGesture(){
  if(!ambience){
    dlog("Initialisation de l'audio global");
    ambience = new Audio("assets/audio/intro.mp3");
    ambience.loop=true;
    ambience.volume=0.25;
    ambience.play().catch(e=>dwarn("Ambience play blocked",e));
  }
}

export function playAudioForScreen(screen){
  if(!ambience) return;
  let src;
  switch(screen){
    case "pseudo": return;
    case "intro": src="assets/audio/intro.mp3"; break;
    case "game": src=stress?"assets/audio/ambiance_stress.mp3":"assets/audio/ambiance.mp3"; break;
    default: return;
  }
  try{
    ambience.pause();
    ambience.src=src;
    ambience.loop=true;
    ambience.volume=0.25;
    ambience.play().catch(e=>dwarn("playAudioForScreen() bloqué",e));
    dlog(`playAudioForScreen("${screen}")`);
  }catch(e){ dwarn(e); }
}

export function stopAllAudio(){
  if(ambience){ ambience.pause(); ambience.currentTime=0; }
}

export function switchToStressAmbience(){
  if(ambience){ stress=true; playAudioForScreen("game"); }
}

export function switchToNormalAmbience(){
  if(ambience){ stress=false; playAudioForScreen("game"); }
}

export function playActionEffect(effect){
  const map={
    bonus:"assets/audio/bonus.mp3",
    error:"assets/audio/erreur.mp3",
    collect:"assets/audio/item.mp3"
  };
  const src=map[effect];
  if(!src){ dwarn(`Effet audio inconnu : ${effect}`); return; }
  new Audio(src).play().catch(()=>{});
}
