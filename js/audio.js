// ===============================
// audio.js — Gestion des musiques & SFX
// ===============================

const AudioBus = (() => {
  const tracks = {
    ambiance: null,
    intro: null,
    victoire: null,
    defaite: null,
  };

  const sfx = {};
  const basePathMusic = "sons/";
  const basePathSfx = "sons/";

  // Volumes par défaut (soft)
  const volumes = {
    ambiance: 0.28,
    intro: 0.35,
    victoire: 0.5,
    defaite: 0.5,
    sfx: 0.5,
  };

  // Chargement paresseux
  function loadTrack(key) {
    if (tracks[key]) return tracks[key];
    const file = {
      ambiance: "ambiance.mp3",
      intro: "intro.mp3",
      victoire: "victoire.mp3",
      defaite: "defaite.mp3",
    }[key];
    if (!file) return null;
    const a = new Audio(basePathMusic + file);
    a.preload = "auto";
    a.volume = volumes[key] ?? 0.4;
    a.loop = key === "ambiance";
    tracks[key] = a;
    return a;
  }

  function loadSfx(name) {
    if (sfx[name]) return sfx[name];
    const a = new Audio(basePathSfx + name);
    a.preload = "auto";
    a.volume = volumes.sfx;
    sfx[name] = a;
    return a;
  }

  // Fondu utilitaires
  function fadeTo(audio, targetVol = 0, duration = 600) {
    if (!audio) return;
    const steps = 20;
    const stepTime = duration / steps;
    const start = audio.volume;
    const delta = (targetVol - start) / steps;
    let n = 0;
    const it = setInterval(() => {
      n++;
      audio.volume = Math.max(0, Math.min(1, start + delta * n));
      if (n >= steps) {
        clearInterval(it);
        if (audio.volume <= 0.001 && targetVol === 0) {
          audio.pause();
          audio.currentTime = 0;
        }
      }
    }, stepTime);
  }

  function stopAllAudio() {
    Object.values(tracks).forEach(a => {
      if (a) { a.pause(); a.currentTime = 0; }
    });
    Object.values(sfx).forEach(a => {
      if (a) { a.pause(); a.currentTime = 0; }
    });
  }

  function playAmbiance() {
    const a = loadTrack("ambiance");
    stopExcept(a);
    a.playbackRate = 1.0;
    a.volume = 0; // on fade-in
    a.play().catch(()=>{});
    fadeTo(a, volumes.ambiance, 800);
  }

  function speedUpAmbiance(intensity01) {
    // intensity01 ∈ [0,1] : 0 = calme, 1 = max tension
    const a = loadTrack("ambiance");
    if (!a) return;
    const rate = 1.0 + 0.8 * intensity01;     // 1.0 → 1.8
    const vol  = 0.2 + 0.25 * intensity01;    // 0.2 → 0.45
    a.playbackRate = rate;
    a.volume = Math.min(0.55, vol);
  }

  function playIntro() {
    const a = loadTrack("intro");
    stopExcept(a);
    a.currentTime = 0;
    a.play().catch(()=>{});
  }

  function playVictory() {
    const a = loadTrack("victoire");
    stopExcept(a);
    a.currentTime = 0;
    a.play().catch(()=>{});
  }

  function playDefeat() {
    const a = loadTrack("defaite");
    stopExcept(a);
    a.currentTime = 0;
    a.play().catch(()=>{});
  }

  function playSfxFile(file) {
    const a = loadSfx(file);
    a.currentTime = 0;
    a.play().catch(()=>{});
  }

  function stopExcept(track) {
    Object.values(tracks).forEach(a => {
      if (a && a !== track) { a.pause(); a.currentTime = 0; }
    });
    // on coupe aussi les SFX persistants potentiels
    Object.values(sfx).forEach(a => { a.pause(); a.currentTime = 0; });
  }

  return {
    playAmbiance,
    speedUpAmbiance,
    playIntro,
    playVictory,
    playDefeat,
    playSfxFile,
    stopAllAudio,
    fadeTo,
  };
})();
