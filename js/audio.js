import { dlog, dwarn } from "./debug.js";

let currentAudio = null;
let introAudio = null;
let normalAudio = null;
let stressAudio = null;

export function initAudioOnUserGesture() {
  dlog("initAudioOnUserGesture() appelé");
  if (!introAudio) {
    introAudio = new Audio("assets/audio/intro.mp3");
    introAudio.loop = true;
    introAudio.volume = 0.5;
    introAudio.play().catch(()=>{});
  }
}

export function playAudioForScreen(screen) {
  stopAllAudio(false);
  dlog(`playAudioForScreen(${screen})`);
  if (screen==="intro" && introAudio) introAudio.play().catch(()=>{});
  if (screen==="game") {
    if (!normalAudio) {
      normalAudio = new Audio("assets/audio/ambiance.mp3");
      normalAudio.loop=true; normalAudio.volume=0.5;
    }
    normalAudio.play().catch(()=>{});
  }
  if (screen==="victory" || screen==="defeat") stopAllAudio();
}

export function stopAllAudio(stopIntro=true) {
  [introAudio, normalAudio, stressAudio].forEach(a=>{if(a){a.pause(); a.currentTime=0;}});
  if(stopIntro) introAudio=null;
}

export function switchToStressAmbience() {
  dlog("switchToStressAmbience()");
  if(normalAudio){normalAudio.pause();}
  if(!stressAudio){
    stressAudio = new Audio("assets/audio/ambiance_stress.mp3");
    stressAudio.loop = true; stressAudio.volume=0.6;
  }
  stressAudio.play().catch(()=>{});
}

export function switchToNormalAmbience() {
  if(stressAudio){ stressAudio.pause(); stressAudio.currentTime=0;}
  if(normalAudio){ normalAudio.play().catch(()=>{});}
}

export function playActionEffect(name) {
  const valid = ["bonus","error"];
  if(!valid.includes(name)) return dwarn(`Effet audio inconnu : ${name}`);
  const audio = new Audio(`assets/audio/${name}.mp3`);
  audio.play().catch(()=>{});
}
