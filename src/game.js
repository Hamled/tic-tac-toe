const Game = function(playerX, playerO) {
  if(playerX === undefined || playerO === undefined) {
    throw new Error('Game must be given two player names');
  }

  this.playerX = playerX;
  this.playerO = playerO;
  this.turn = 1;
};

// Constants
Game.LAST_TURN = 9;
Game.BOARD_POS_MIN = 0;
Game.BOARD_POS_MAX = 8;

// Instance Methods
Game.prototype.currentPlayer = function() {
  return (this.turn % 2 === 0) ? this.playerO
                               : this.playerX;
};

Game.prototype.play = function(position) {
  if(!Game.isValidPosition(position)) {
    throw new Error('play() requires a valid board cell position');
  }

  if(this.turn > Game.LAST_TURN) {
    throw new Error('Cannot play because game is already completed');
  }

  this.turn++;
};

Game.prototype.boardAt = function() {

};

// Static Methods
Game.isValidPosition = function(position) {
  return Number.isInteger(position) && (position >= this.BOARD_POS_MIN &&
                                        position <= this.BOARD_POS_MAX);
};

export default Game;
