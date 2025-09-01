// plume.js : Effets d'écriture type plume dans un grimoire
export function typeWriterEffect(element, text, speed = 50) {
  element.textContent = "";
  let i = 0;
  const interval = setInterval(() => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(interval);
    }
  }, speed);
}

// Effets d'intro multiples
export const intros = [
  "Bienvenue jeune aventurier, le royaume vous attend...",
  "La nuit tombe sur le royaume oublié, votre destin commence ici...",
  "Les étoiles s'alignent pour révéler votre chemin..."
];

// Effets de fin personnalisées
export const victoryMessages = [
  "Félicitations, héros ! Le royaume est sauvé !",
  "Votre courage et votre intelligence ont triomphé !",
  "Les arcanes du royaume vous remercient !"
];

export const defeatMessages = [
  "Le royaume s'effondre... Votre mission échouée.",
  "Les ténèbres ont vaincu, le royaume est perdu.",
  "Vous avez échoué, mais l'aventure continue..."
];
