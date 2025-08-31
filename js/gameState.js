export const GameState = {
  player: null,
  score: 0,
  time: 300,
  puzzlesDone: [],
  debug: false,
  reset() {
    this.player = null;
    this.score = 0;
    this.time = 300;
    this.puzzlesDone = [];
  }
};
