const Game = function(playerX, playerO) {
  if(playerX === undefined || playerO === undefined) {
    throw new Error('Game must be given two player names');
  }

  this.playerX = playerX;
  this.playerO = playerO;
  this.turn = 1;

  this.board = new Array(Game.BOARD_POS_MAX + 1);
  this.board.fill(Game.EMPTY_CELL);
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

  if(this.turn > Game.LAST_TURN || this.outcome() !== null) {
    throw new Error('Cannot play because game is already completed');
  }

  if(this.board[position] !== Game.EMPTY_CELL) {
    throw new Error('Cannot play because that position is already marked');
  }

  this.board[position] = this.playerMark(this.currentPlayer());

  this.turn++;
};

Game.prototype.outcome = function() {
  var board = this.board;
  var isWin = function(pos1, pos2, pos3) {
    return board[pos1] === board[pos2] &&
           board[pos1] === board[pos3] &&
           board[pos1] !== Game.EMPTY_CELL;
  };

  // Determine the winner by checking:
  // All win conditions involving cell 0
  if(isWin(0, 1, 2) || isWin(0, 3, 6) || isWin(0, 4, 8)) {
    return board[0];
  }

  // All win conditions involving cell 4
  if(isWin(3, 4, 5) || isWin(1, 4, 7) || isWin(2, 4, 6)) {
    return board[4];
  }

  // All win conditions involving cell 8
  if(isWin(6, 7, 8) || isWin(2, 5, 8)) {
    return board[8];
  }

  // Otherwise, no clear winner. In that case it's a tie
  // only if the board is completely filled.
  var outcome = Game.EMPTY_CELL; // EMPTY_CELL means tie
  this.board.forEach(function(cell) {
    if(cell === Game.EMPTY_CELL) {
      outcome = null; // No winner yet
    }
  });

  return outcome;
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
