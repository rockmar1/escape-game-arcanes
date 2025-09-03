// js/audio.js
import { dlog, dwarn } from "./debug.js";

const MUSIC_MAP = {
  intro: "assets/audio/intro.mp3",
  game:  "assets/audio/game.mp3",
  stress:"assets/audio/stress.mp3",
  victory:"assets/audio/victory.mp3",
  defeat:"assets/audio/defeat.mp3"
};
const SFX_MAP = {
  quill:"assets/audio/sfx-quill.mp3",
  correct:"assets/audio/sfx-correct.mp3",
  error:"assets/audio/sfx-error.mp3",
  portal:"assets/audio/sfx-portal.mp3"
};

let bgm = null, currentKey = null;
let preloaded = { bgm:{}, sfx:{} };

function _makeAudio(src,{loop=false,volume=0.7}={}){ try{ const a=new Audio(src); a.loop=!!loop; a.volume=volume; a.preload="auto"; return a; }catch(e){ dwarn("audio create failed",src,e); return null; } }
function _preload(){ Object.entries(MUSIC_MAP).forEach(([k,s])=>{ try{ preloaded.bgm[k]=_makeAudio(s,{loop:k==="game",volume:0.6}); }catch(e){} }); Object.entries(SFX_MAP).forEach(([k,s])=>{ try{ preloaded.sfx[k]=_makeAudio(s,{loop:false,volume:0.85}); }catch(e){} }); }
_preload();

export function initAudioOnUserGesture(){
  try{
    Object.values(preloaded.bgm).forEach(a=>{ if(!a) return; const p=a.play(); if(p && p.catch) p.then(()=>a.pause()).catch(()=>a.pause()); });
    if(preloaded.sfx.quill){ preloaded.sfx.quill.play().then(()=>preloaded.sfx.quill.pause()).catch(()=>{}); }
    dlog("initAudioOnUserGesture done");
  }catch(e){ dwarn("initAudioOnUserGesture fail",e); }
}

export function playMusic(key,{loop=true,volume=0.6}={}) {
  try{
    const src=MUSIC_MAP[key];
    if(!src){ dwarn("Unknown music key",key); return; }
    if(currentKey===key && bgm && !bgm.paused) return;
    if(bgm){ try{ bgm.pause(); bgm.currentTime=0; }catch(e){} bgm=null; currentKey=null; }
    let a=preloaded.bgm[key]||_makeAudio(src,{loop,volume});
    if(!a){ dwarn("music missing",key); return; }
    a.loop=loop; a.volume=volume; bgm=a;currentKey=key;
    const p=bgm.play(); if(p&&p.catch) p.catch(()=>{});
    dlog("playMusic",key);
  }catch(e){ dwarn("playMusic err",e); }
}

export function stopAllMusic(){ try{ if(bgm){ bgm.pause(); try{ bgm.currentTime=0; }catch(e){} bgm=null; currentKey=null; } dlog("stopAllMusic"); }catch(e){ dwarn("stopAllMusic",e); } }

export function playSfx(key, vol=0.85){ try{ const src=SFX_MAP[key]; if(!src){ dwarn("Unknown sfx",key); return; } const s=_makeAudio(src,{loop:false,volume:vol}); if(!s) return; s.play().catch(()=>{}); dlog("playSfx",key); }catch(e){ dwarn("playSfx err",e); } }

export function switchToStressAmbience(){ playMusic("stress",{loop:true,volume:0.65}); dlog("switchToStressAmbience"); }
export function switchToNormalAmbience(){ playMusic("game",{loop:true,volume:0.55}); dlog("switchToNormalAmbience"); }
export function getCurrentTrack(){ return currentKey; }
