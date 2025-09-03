// js/plume.js
import { playSfx } from "./audio.js";
import { dlog } from "./debug.js";

export function writeWithQuill(el, text, opts={}) {
  const speed = typeof opts.speed==="number" ? opts.speed : 28;
  const sfxEvery = typeof opts.sfxEvery==="number" ? opts.sfxEvery : 7;
  if(!el) return Promise.resolve();
  el.textContent="";
  let i=0;
  return new Promise(resolve=>{
    function step(){
      if(i<text.length){
        el.textContent += text.charAt(i);
        if(i % sfxEvery === 0) playSfx("quill",0.35);
        i++; setTimeout(step,speed);
      } else { dlog("plume finished"); resolve(); }
    }
    step();
  });
}
