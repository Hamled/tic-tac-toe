const Game = function(playerX, playerO) {
  if(playerX === undefined || playerO === undefined) {
    throw new Error('Game must be given two player names');
  }

  this.playerX = playerX;
  this.playerO = playerO;
  this.turn = 1;
  this.board = [' ', ' ', ' ',
                ' ', ' ', ' ',
                ' ', ' ', ' '];
};

// Constants
Game.LAST_TURN = 9;
Game.BOARD_POS_MIN = 0;
Game.BOARD_POS_MAX = 8;
Game.EMPTY_CELL = ' ';

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

  if(this.board[position] !== Game.EMPTY_CELL) {
    throw new Error('Cannot play because that position is already marked');
  }

  this.board[position] = this.playerMark(this.currentPlayer());

  this.turn++;
};

Game.prototype.boardAt = function(position) {
  if(!Game.isValidPosition(position)) {
    throw new Error('boardAt() requires a valid board cell position');
  }

  return this.board[position];
};

Game.prototype.playerMark = function(player) {
  if(player === this.playerX) {
    return 'X';
  } else if(player === this.playerO) {
    return 'O';
  } else {
    throw new Error(`${player} is not one of the game's players`);
  }
};

// Static Methods
Game.isValidPosition = function(position) {
  return Number.isInteger(position) && (position >= this.BOARD_POS_MIN &&
                                        position <= this.BOARD_POS_MAX);
};

export default Game;
