// audio.js
import { dlog, dwarn } from "./debug.js";

let globalAmbience = null;

export function initAudioOnUserGesture() {
    dlog("initAudioOnUserGesture() appelé");
    if(globalAmbience) return;
    globalAmbience = new Audio("assets/audio/ambiance_intro.mp3");
    globalAmbience.loop = true;
    globalAmbience.volume = 0.5;
    globalAmbience.play().catch(()=>{});
}

export function playAudioForScreen(screen) {
    dlog("playAudioForScreen()", screen);
    if(globalAmbience){ globalAmbience.pause(); globalAmbience=null; }
    let src="";
    switch(screen){
        case "pseudo":
        case "intro": src="assets/audio/intro.mp3"; break;
        case "game": src="assets/audio/ambiance.mp3"; break;
        case "victory": case "defeat": src=""; break;
        default: src="assets/audio/ambiance.mp3";
    }
    if(src){
        globalAmbience = new Audio(src);
        globalAmbience.loop=true;
        globalAmbience.volume=0.5;
        globalAmbience.play().catch(()=>{});
    }
}

export function stopAllAudio(){
    if(globalAmbience){ globalAmbience.pause(); globalAmbience=null; }
}

export function switchToStressAmbience(){
    stopAllAudio();
    globalAmbience = new Audio("assets/audio/ambiance_stress.mp3");
    globalAmbience.loop=true;
    globalAmbience.volume=0.5;
    globalAmbience.play().catch(()=>{});
}

export function switchToNormalAmbience(){
    stopAllAudio();
    globalAmbience = new Audio("assets/audio/ambiance.mp3");
    globalAmbience.loop=true;
    globalAmbience.volume=0.5;
    globalAmbience.play().catch(()=>{});
}

export function playActionEffect(effect){
    let src="";
    switch(effect){
        case "bonus": src="assets/audio/bonus.mp3"; break;
        case "error": src="assets/audio/erreur.mp3"; break;
        default: dwarn("Effet audio inconnu : " + effect); return;
    }
    const sfx = new Audio(src);
    sfx.play().catch(()=>{});
}
