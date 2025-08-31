// centralise puzzles metadata + helper for admin
export const Puzzles = [
  { id:"runes", zone:"zone-bibliotheque", title:"Runes anciennes", module:"./puzzles/puzzleRunes.js" },
  { id:"texteInverse", zone:"zone-bibliotheque", title:"Texte inversé", module:"./puzzles/puzzleTextInverse.js" },
  { id:"potions", zone:"zone-labo", title:"Potion mystique", module:"./puzzles/puzzlePotions.js" },
  { id:"labyrinthe", zone:"zone-labo", title:"Labyrinthe", module:"./puzzles/puzzleLabyrinth.js" },
  { id:"etoiles", zone:"zone-observatoire", title:"Constellation", module:"./puzzles/puzzleStars.js" },
  { id:"cristaux", zone:"zone-observatoire", title:"Cristaux sonores", module:"./puzzles/puzzleCrystals.js" },
  { id:"horloge", zone:"zone-observatoire", title:"Horloge enchantée", module:"./puzzles/puzzleClock.js" }
];
export function getSolutions(){ 
  // simple static mapping; puzzles modules can export richer solutions if needed
  return {
    runes: "MAGIE",
    texteInverse: "LUMOS",
    potions: "WATER+FIRE+HERB",
    labyrinthe: "SORTIE NORD",
    etoiles: "ORION",
    cristaux: "DO RE MI",
    horloge: "MINUIT"
  };
}
