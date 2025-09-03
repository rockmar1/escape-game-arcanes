// plume.js
export function initPlumeAnimations(callback) {
  const container = document.querySelector('.plume-text');
  if (!container) {
    console.warn('[WARN] Aucun container plume trouvé');
    if (callback) callback();
    return;
  }

  const text = container.dataset.text || '';
  container.textContent = '';
  document.body.classList.add('plume-cursor');

  let index = 0;
  const speed = 50;

  const interval = setInterval(() => {
    if (index < text.length) {
      container.textContent += text[index];
      index++;
      // Son plume à chaque lettre
      const sfx = new Audio('assets/audio/sfx-quill.mp3');
      sfx.volume = 0.2;
      sfx.play().catch(()=>{});
    } else {
      clearInterval(interval);
      document.body.classList.remove('plume-cursor');
      if (callback) callback();
    }
  }, speed);
}
