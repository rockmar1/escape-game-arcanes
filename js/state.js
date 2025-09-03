// === État global du jeu ===
export let gameState = {
  playerName: "",
  score: 0,
  currentPuzzleIndex: 0,
  timerRunning: false,
  remainingTime: 0
};

// === Liste des puzzles pour l'admin et le router ===
export const puzzles = [
  {
    meta: { title: "Énigme 1", answer: "Réponse1" },
    mount: function({ onSolved, onFail }) {
      // code du puzzleClock
      if (onSolved) setTimeout(() => onSolved({ score: 10 }), 1000);
    }
  },
  {
    meta: { title: "Énigme 2", answer: "Réponse2" },
    mount: function({ onSolved, onFail }) {
      // code du puzzleCrystals
      if (onSolved) setTimeout(() => onSolved({ score: 10 }), 1000);
    }
  },
  {
    meta: { title: "Énigme 3", answer: "Réponse3" },
    mount: function({ onSolved, onFail }) {
      // code du puzzleLabyrinth
      if (onSolved) setTimeout(() => onSolved({ score: 10 }), 1000);
    }
  },
  {
    meta: { title: "Énigme 4", answer: "Réponse4" },
    mount: function({ onSolved, onFail }) {
      // code du puzzlePotions
      if (onSolved) setTimeout(() => onSolved({ score: 10 }), 1000);
    }
  },
  {
    meta: { title: "Énigme 5", answer: "Réponse5" },
    mount: function({ onSolved, onFail }) {
      // code du puzzleRunes
      if (onSolved) setTimeout(() => onSolved({ score: 10 }), 1000);
    }
  },
  {
    meta: { title: "Énigme 6", answer: "Réponse6" },
    mount: function({ onSolved, onFail }) {
      // code du puzzleStars
      if (onSolved) setTimeout(() => onSolved({ score: 10 }), 1000);
    }
  },
  {
    meta: { title: "Énigme 7", answer: "Réponse7" },
    mount: function({ onSolved, onFail }) {
      // code du puzzleTextInverse
      if (onSolved) setTimeout(() => onSolved({ score: 10 }), 1000);
    }
  }
];

// === Fonctions de gestion du joueur et du score ===
export function setPlayerName(name) {
  gameState.playerName = name;
}

export function getPlayerName() {
  return gameState.playerName;
}

export function setScore(value) {
  gameState.score = value;
}

export function getScore() {
  return gameState.score;
}

export function incrementScore(amount) {
  gameState.score += amount;
}

export function resetScore() {
  gameState.score = 0;
}

export function nextPuzzle() {
  if (gameState.currentPuzzleIndex < puzzles.length - 1) {
    gameState.currentPuzzleIndex++;
  }
  return puzzles[gameState.currentPuzzleIndex];
}

export function resetPuzzles() {
  gameState.currentPuzzleIndex = 0;
}

export function getCurrentPuzzleIndex() {
  return gameState.currentPuzzleIndex;
}
