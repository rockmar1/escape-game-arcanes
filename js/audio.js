import { dlog, dwarn } from "./debug.js";

let currentAudio=null;
let ambienceNormal=new Audio("assets/audio/ambiance.mp3");
let ambienceStress=new Audio("assets/audio/ambiance_stress.mp3");

export function initAudioOnUserGesture(){
  dlog("initAudioOnUserGesture()");
  if(!currentAudio){ currentAudio=ambienceNormal; currentAudio.loop=true; currentAudio.play().catch(()=>dwarn("Impossible d'init audio")); }
}

export function playActionEffect(effect){
  let audio=null;
  switch(effect){
    case "bonus": audio=new Audio("assets/audio/bonus.mp3"); break;
    case "error": audio=new Audio("assets/audio/error.mp3"); break;
    default: dwarn("Effet audio inconnu : "+effect); return;
  }
  audio.play().catch(()=>{});
}

export function stopAllAudio(){ [currentAudio,ambienceNormal,ambienceStress].forEach(a=>{if(a&&!a.paused)a.pause();}); }
export function switchToStressAmbience(){ if(currentAudio!==ambienceStress){stopAllAudio(); currentAudio=ambienceStress; currentAudio.loop=true; currentAudio.play().catch(()=>{});}}
export function switchToNormalAmbience(){ if(currentAudio!==ambienceNormal){stopAllAudio(); currentAudio=ambienceNormal; currentAudio.loop=true; currentAudio.play().catch(()=>{});}}
