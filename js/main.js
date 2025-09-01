// main.js
import { initRouter, goToScreen, startNextMiniGame } from "./router.js";
import { setPlayerName } from "./state.js";
import { dlog } from "./debug.js";
import { initAudioOnUserGesture } from "./audio.js";
import "./admin.js";

document.addEventListener("DOMContentLoaded",()=>{
    dlog("🎮 Initialisation du jeu...");

    initRouter();

    const startBtn = document.getElementById("start-btn");
    const beginBtn = document.getElementById("begin-game");
    const nameInput = document.getElementById("player-name");

    // --- Premier clic utilisateur pour lever la restriction audio ---
    function firstClickHandler(){
        dlog("🖱️ Premier clic -> initAudioOnUserGesture()");
        document.removeEventListener("click", firstClickHandler);
        try{ initAudioOnUserGesture(); }catch(e){ dlog("Erreur initAudioOnUserGesture()",e); }
    }
    document.addEventListener("click", firstClickHandler, {once:true});

    // --- Bouton pseudo ---
    startBtn.addEventListener("click",()=>{
        const name = nameInput.value.trim();
        if(!name){ alert("Entre un pseudo !"); return; }
        setPlayerName(name);
        dlog("✅ Pseudo validé : "+name);
        document.getElementById("intro-content").textContent = `Bienvenue ${name}, le royaume t’attend...`;
        goToScreen("intro");
    });

    // --- Bouton début aventure ---
    beginBtn.addEventListener("click",()=>{
        dlog("🖱️ Clic #begin-game -> startNextMiniGame()");
        startNextMiniGame();
    });
});
