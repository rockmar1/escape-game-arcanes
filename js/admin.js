import { endGame, startNextMiniGame, resetGame } from "./router.js";

const ADMIN_PASSWORD_HASH = "f3ada405ce890b6f8204094deb12d8a8b"; // "admin"

export function initAdminPanel() {
  const btn = document.createElement("button");
  btn.id = "admin-toggle";
  btn.textContent = "⚙️ Admin";
  btn.style.position="fixed"; btn.style.bottom="10px"; btn.style.right="10px"; btn.style.zIndex="1000";
  document.body.appendChild(btn);

  btn.addEventListener("click", ()=>{
    const pass = prompt("🔑 Mot de passe admin :");
    if(!pass || md5(pass) !== ADMIN_PASSWORD_HASH){ alert("⛔ Mot de passe incorrect"); return; }
    openAdminMenu();
  });
}

function openAdminMenu() {
  let panel = document.getElementById("admin-panel");
  if(!panel){
    panel = document.createElement("div");
    panel.id="admin-panel";
    panel.style.position="fixed"; panel.style.bottom="50px"; panel.style.right="10px";
    panel.style.padding="15px"; panel.style.background="rgba(0,0,0,0.9)";
    panel.style.color="white"; panel.style.zIndex="1000"; panel.style.borderRadius="8px";
    panel.innerHTML=`
      <h4>⚙️ Admin</h4>
      <button id="force-victory">✅ Victoire</button>
      <button id="force-defeat">❌ Défaite</button>
      <button id="skip-puzzle">⏭️ Skip Puzzle</button>
      <button id="reset-game">🔄 Reset Jeu</button>
      <button id="close-admin">❌ Fermer</button>
    `;
    document.body.appendChild(panel);

    document.getElementById("force-victory").addEventListener("click", ()=>endGame(true));
    document.getElementById("force-defeat").addEventListener("click", ()=>endGame(false));
    document.getElementById("skip-puzzle").addEventListener("click", ()=>startNextMiniGame());
    document.getElementById("reset-game").addEventListener("click", ()=>resetGame());
    document.getElementById("close-admin").addEventListener("click", ()=>panel.remove());
  }
}

// simple MD5 JS (https://stackoverflow.com/a/16554836)
function md5(string) {
  function L(k,d){return (k<<d)|(k>>>(32-d))}
  function K(G,k){return (G+k)&0xffffffff}
  function FF(a,b,c,d,x,s,ac){a=K(a+K(K(b,a),K(c,d))+x+ac);return L(a,s)+b}
  function GG(a,b,c,d,x,s,ac){a=K(a+K(K(b,a),K(c,d))+x+ac);return L(a,s)+b}
  function HH(a,b,c,d,x,s,ac){a=K(a+K(K(b,a),K(c,d))+x+ac);return L(a,s)+b}
  function II(a,b,c,d,x,s,ac){a=K(a+K(K(b,a),K(c,d))+x+ac);return L(a,s)+b}
  function convertToWordArray(str){
    let lWordCount=[],lMessageLength=str.length;for(let i=0;i<lMessageLength;i++){lWordCount[i>>2]|=(str.charCodeAt(i)&255)<<((i%4)*8);}return lWordCount;
  }
  function wordToHex(lValue){let WordToHexValue="",WordToHexValueTemp="",lByte,lCount;for(lCount=0;lCount<=3;lCount++){lByte=(lValue>>>(lCount*8))&255;WordToHexValueTemp="0"+lByte.toString(16);WordToHexValue+=WordToHexValueTemp.substr(WordToHexValueTemp.length-2,2);}return WordToHexValue;}
  function Utf8Encode(string){string=string.replace(/\r\n/g,"\n");let utftext="";for(let n=0;n<string.length;n++){let c=string.charCodeAt(n);if(c<128){utftext+=String.fromCharCode(c);}else if(c>127 && c<2048){utftext+=String.fromCharCode((c>>6)|192);utftext+=String.fromCharCode((c&63)|128);}else{utftext+=String.fromCharCode((c>>12)|224);utftext+=String.fromCharCode(((c>>6)&63)|128);utftext+=String.fromCharCode((c&63)|128);}}return utftext;}
  let x=convertToWordArray(Utf8Encode(string)),a=1732584193,b=4023233417,c=2562383102,d=271733878;for(let i=0;i<x.length;i+=16){let olda=a,oldb=b,oldc=c,oldd=d;a=FF(a,b,c,d,x[i+0],7,3614090360);d=FF(d,a,b,c,x[i+1],12,3905402710);c=FF(c,d,a,b,x[i+2],17,606105819);b=FF(b,c,d,a,x[i+3],22,3250441966);a=GG(a,b,c,d,x[i+1],5,4118548399);d=GG(d,a,b,c,x[i+6],9,1200080426);c=GG(c,d,a,b,x[i+11],14,2821735955);b=GG(b,c,d,a,x[i+0],20,4249261313);a=HH(a,b,c,d,x[i+5],4,1770035416);d=HH(d,a,b,c,x[i+8],11,2336552874);c=HH(c,d,a,b,x[i+11],16,4294925233);b=II(b,c,d,a,x[i+0],6,2304563134);a=II(a,b,c,d,x[i+7],10,1804603682);d=II(d,a,b,c,x[i+14],15,4254626195);c=II(c,d,a,b,x[i+5],21,2792965006);b=II(b,c,d,a,x[i+12],6,1236535329);a=II(a,b,c,d,x[i+3],10,4129170786);d=II(d,a,b,c,x[i+10],15,1816531622);c=II(c,d,a,b,x[i+1],21,289558905);b=II(b,c,d,a,x[i+8],6,4055378482);a=II(a,b,c,d,x[i+15],10,3299628645);d=II(d,a,b,c,d,x[i+6],15,4096336452);c=wordToHex(a)+wordToHex(b)+wordToHex(c)+wordToHex(d);return c.toLowerCase();
}
