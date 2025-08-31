// ===============================
// puzzles.js — Mini-jeux modulaires (versions légères mais jouables)
// ===============================

const Puzzles = (() => {
  // état interne des puzzles
  const solved = {
    runes: false,
    potions: false,
    labyrinthe: false,
    etoiles: false,
  };

  // Indices “narratifs”
  const hints = {
    runes: "Les runes se lisent dans le souffle du mot… « MAGIE ».",
    potions: "Ce qui éteint vient d’abord, ce qui embrase ensuite, puis ce qui apaise.",
    labyrinthe: "Garde la main près du mur… parfois il faut oser tourner à droite.",
    etoiles: "Compter les éclats dans l’ordre où ils ont dansé.",
  };

  // Modal simple généré à la volée (pas besoin de CSS dédié)
  function ensureModal() {
    let modal = document.getElementById("game-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "game-modal";
      Object.assign(modal.style, {
        position: "fixed", inset: "0", background: "rgba(0,0,0,0.8)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: "9999",
      });
      const box = document.createElement("div");
      box.id = "game-modal-box";
      Object.assign(box.style, {
        background: "rgba(15,15,30,0.95)",
        border: "2px solid #d4af37",
        borderRadius: "12px",
        color: "#f5e6d3",
        padding: "18px",
        maxWidth: "650px",
        width: "90%",
        textAlign: "center",
        boxShadow: "0 0 30px rgba(212,175,55,0.5)"
      });
      modal.appendChild(box);
      document.body.appendChild(modal);
    }
    return modal;
  }

  function closeModal() {
    const modal = document.getElementById("game-modal");
    if (modal) modal.remove();
  }

  function setSolved(key) {
    solved[key] = true;
    GameState.puzzles[key] = true;
    GameState.player.score += 100; // scoring simple
    document.getElementById("score-display").textContent = GameState.player.score;
  }

  function offerHint(key) {
    if (!confirm("Souhaites-tu un indice ?")) return;
    AudioBus.playSfxFile("indice.mp3");
    alert(hints[key]);
    // Si tu veux pénaliser le score lors d’un indice :
    GameState.player.score = Math.max(0, GameState.player.score - 20);
    document.getElementById("score-display").textContent = GameState.player.score;
  }

  // ─────────────────────────────
  // 🔮 Puzzle des RUNES (mot = MAGIE)
  // ─────────────────────────────
  function startRunes() {
    AudioBus.playSfxFile("grimoire.mp3");
    const modal = ensureModal();
    const box = document.getElementById("game-modal-box");
    box.innerHTML = `
      <h2>🔮 Puzzle des Runes</h2>
      <p>Les runes frémissent… Clique-les dans l’ordre pour former le mot sacré.</p>
      <div id="runes-letters" style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:12px 0;"></div>
      <div id="runes-input" style="font-size:1.3rem;margin:8px 0;letter-spacing:4px;min-height:28px;"></div>
      <div>
        <button id="runes-reset">Réinitialiser</button>
        <button id="runes-hint">Indice</button>
        <button id="runes-quit">Quitter</button>
      </div>
    `;

    const target = "MAGIE";
    const letters = target.split("");
    const shuffled = [...letters].sort(() => Math.random() - 0.5);
    const area = box.querySelector("#runes-letters");
    const inputEl = box.querySelector("#runes-input");

    const picked = [];
    shuffled.forEach((ch,i) => {
      const b = document.createElement("button");
      b.textContent = ch;
      b.style.margin = "4px";
      b.addEventListener("click", () => {
        if (picked.length >= letters.length) return;
        picked.push(ch);
        inputEl.textContent = picked.join("");
        AudioBus.playSfxFile("bonus.mp3");
        if (picked.length === letters.length) {
          if (picked.join("") === target) {
            AudioBus.playSfxFile("enigme_reussie.mp3");
            setSolved("runes");
            alert("Les runes scintillent : succès !");
            closeModal();
            Puzzles.checkAllSolved();
          } else {
            AudioBus.playSfxFile("erreur.mp3");
            if (confirm("Ordre incorrect. Recommencer ?")) {
              picked.length = 0; inputEl.textContent = "";
            } else {
              offerHint("runes");
            }
          }
        }
      });
      area.appendChild(b);
    });

    box.querySelector("#runes-reset").onclick = () => {
      picked.length = 0; inputEl.textContent = "";
      AudioBus.playSfxFile("error.mp3");
    };
    box.querySelector("#runes-hint").onclick = () => offerHint("runes");
    box.querySelector("#runes-quit").onclick = closeModal;
  }

  // ─────────────────────────────
  // ⚗️ Puzzle des POTIONS (ordre : Eau → Feu → Herbe)
  // ─────────────────────────────
  function startPotions() {
    AudioBus.playSfxFile("fiole.mp3");
    const modal = ensureModal();
    const box = document.getElementById("game-modal-box");
    box.innerHTML = `
      <h2>⚗️ Alchimie Magique</h2>
      <p>Compose l’élixir parfait : trois fioles, un seul ordre.</p>
      <div style="display:flex;gap:10px;justify-content:center;margin:12px;">
        <button data-i="Eau">💧 Eau</button>
        <button data-i="Feu">🔥 Feu</button>
        <button data-i="Herbe">🌿 Herbe</button>
      </div>
      <div id="mix" style="min-height:28px;margin:8px 0;"></div>
      <div>
        <button id="potions-reset">Réinitialiser</button>
        <button id="potions-hint">Indice</button>
        <button id="potions-quit">Quitter</button>
      </div>
    `;

    const correct = ["Eau", "Feu", "Herbe"];
    const current = [];
    const mixEl = box.querySelector("#mix");

    box.querySelectorAll("[data-i]").forEach(btn => {
      btn.addEventListener("click", () => {
        if (current.length >= 3) return;
        current.push(btn.dataset.i);
        AudioBus.playSfxFile("item.mp3");
        mixEl.textContent = current.join(" → ");
        if (current.length === 3) {
          if (current.every((v,i) => v === correct[i])) {
            AudioBus.playSfxFile("bonus.mp3");
            setSolved("potions");
            alert("La potion brille d’un éclat pur : réussite !");
            closeModal();
            Puzzles.checkAllSolved();
          } else {
            AudioBus.playSfxFile("error.mp3");
            if (confirm("Mauvaise recette… recommencer ?")) {
              current.length = 0; mixEl.textContent = "";
            } else {
              offerHint("potions");
            }
          }
        }
      });
    });

    box.querySelector("#potions-reset").onclick = () => {
      current.length = 0; mixEl.textContent = "";
      AudioBus.playSfxFile("error.mp3");
    };
    box.querySelector("#potions-hint").onclick = () => offerHint("potions");
    box.querySelector("#potions-quit").onclick = closeModal;
  }

  // ─────────────────────────────
  // 🗝️ Labyrinthe (chemin 3 pas : Haut → Droite → Bas)
  // ─────────────────────────────
  function startLabyrinthe() {
    AudioBus.playSfxFile("grimoire.mp3");
    const modal = ensureModal();
    const box = document.getElementById("game-modal-box");
    box.innerHTML = `
      <h2>🗝️ Labyrinthe Magique</h2>
      <p>Choisis trois pas pour sortir : Haut / Droite / Bas / Gauche.</p>
      <div id="path" style="margin:8px 0;min-height:28px;"></div>
      <div style="display:flex;gap:8px;justify-content:center;margin:12px 0;">
        <button data-d="Haut">⬆️ Haut</button>
        <button data-d="Droite">➡️ Droite</button>
        <button data-d="Bas">⬇️ Bas</button>
        <button data-d="Gauche">⬅️ Gauche</button>
      </div>
      <div>
        <button id="lab-reset">Réinitialiser</button>
        <button id="lab-hint">Indice</button>
        <button id="lab-quit">Quitter</button>
      </div>
    `;

    const correct = ["Haut", "Droite", "Bas"];
    const seq = [];
    const pathEl = box.querySelector("#path");

    box.querySelectorAll("[data-d]").forEach(btn => {
      btn.onclick = () => {
        if (seq.length >= 3) return;
        seq.push(btn.dataset.d);
        AudioBus.playSfxFile("scintillement.mp3");
        pathEl.textContent = seq.join(" → ");
        if (seq.length === 3) {
          if (seq.every((v,i)=>v===correct[i])) {
            AudioBus.playSfxFile("bonus.mp3");
            setSolved("labyrinthe");
            alert("Tu trouves la sortie ! Réussite.");
            closeModal();
            Puzzles.checkAllSolved();
          } else {
            AudioBus.playSfxFile("erreur.mp3");
            if (confirm("Cul-de-sac ! Recommencer ?")) {
              seq.length = 0; pathEl.textContent = "";
            } else {
              offerHint("labyrinthe");
            }
          }
        }
      };
    });

    box.querySelector("#lab-reset").onclick = () => {
      seq.length = 0; pathEl.textContent = "";
      AudioBus.playSfxFile("error.mp3");
    };
    box.querySelector("#lab-hint").onclick = () => offerHint("labyrinthe");
    box.querySelector("#lab-quit").onclick = closeModal;
  }

  // ─────────────────────────────
  // ✨ Constellation (mémoire : 3 étoiles à cliquer dans l’ordre)
  // ─────────────────────────────
  function startEtoiles() {
    AudioBus.playSfxFile("etoile.mp3");
    const modal = ensureModal();
    const box = document.getElementById("game-modal-box");
    box.innerHTML = `
      <h2>✨ Constellation Mystique</h2>
      <p>Observe les éclats, puis reproduis leur ordre…</p>
      <div id="star-grid" style="display:grid;grid-template-columns:repeat(5,50px);gap:8px;justify-content:center;margin:12px 0;"></div>
      <div>
        <button id="stars-hint">Indice</button>
        <button id="stars-quit">Quitter</button>
      </div>
    `;

    const grid = box.querySelector("#star-grid");
    const cells = Array.from({length: 10}, (_,i)=>i); // 10 positions
    const seq = [];
    // séquence aléatoire de 3 positions
    const solution = cells.sort(()=>Math.random()-0.5).slice(0,3);

    // Affiche brièvement la séquence (clignote)
    function flashSequence() {
      let i = 0;
      const interval = setInterval(() => {
        if (i > solution.length-1) { clearInterval(interval); return; }
        flashCell(solution[i]);
        i++;
      }, 600);
    }

    function flashCell(index) {
      const target = grid.children[index];
      target.style.boxShadow = "0 0 12px 6px #d4af37";
      setTimeout(()=>{ target.style.boxShadow = "none"; }, 350);
    }

    // Construire la grille
    for (let i=0;i<10;i++) {
      const b = document.createElement("button");
      b.textContent = "★";
      b.style.fontSize = "18px";
      b.style.padding = "10px";
      b.onclick = () => {
        seq.push(i);
        AudioBus.playSfxFile("scintillement.mp3");
        if (seq.length === 3) {
          const ok = seq.every((v,j)=>v===solution[j]);
          if (ok) {
            AudioBus.playSfxFile("bonus.mp3");
            setSolved("etoiles");
            alert("La constellation s’illumine : succès !");
            closeModal();
            Puzzles.checkAllSolved();
          } else {
            AudioBus.playSfxFile("erreur.mp3");
            if (confirm("L’ordre était différent. Rejouer ?")) {
              seq.length = 0;
              flashSequence();
            } else {
              offerHint("etoiles");
            }
          }
        }
      };
      grid.appendChild(b);
    }

    // Montrer la séquence au début
    setTimeout(flashSequence, 350);

    box.querySelector("#stars-hint").onclick = () => offerHint("etoiles");
    box.querySelector("#stars-quit").onclick = closeModal;
  }

  function start(puzzleKey) {
    switch (puzzleKey) {
      case "runes": return startRunes();
      case "potions": return startPotions();
      case "labyrinthe": return startLabyrinthe();
      case "etoiles": return startEtoiles();
      default: alert("Puzzle inconnu."); 
    }
  }

  function checkAllSolved() {
    const allDone = Object.values(GameState.puzzles).every(Boolean);
    if (allDone && !GameState.victory && !GameState.defeat) {
      // petite narration de fin (la vraie finition est gérée dans main.js)
      const text = [
        `Les arcanes s’ouvrent, ${GameState.player.name}.`,
        `Les runes chantent ton nom, ${GameState.player.name}.`,
        `La tour se dresse devant toi, ${GameState.player.name}.`,
      ];
      const line = text[Math.floor(Math.random()*text.length)];
      setTimeout(()=> {
        triggerVictory(`${line} Tu as restauré l’équilibre du Royaume !`);
      }, 400);
    }
  }

  return {
    start,
    checkAllSolved,
  };
})();
