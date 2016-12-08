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

  if(this.turn > Game.LAST_TURN) {
    throw new Error('Cannot play because game is already completed');
  }

  if(this.board[position] !== Game.EMPTY_CELL) {
    throw new Error('Cannot play because that position is already marked');
  }

  this.board[position] = this.playerMark(this.currentPlayer());

  this.turn++;
};

Game.prototype.outcome = function() {
  // Determine the winner by checking:

  // First, each row:
  for(var row = 0; row < 3; row++) {
    if(this.board[row * 3 + 0] === Game.EMPTY_CELL) {
      continue;
    }

    if(this.board[row * 3 + 0] === this.board[row * 3 + 1] &&
       this.board[row * 3 + 0] === this.board[row * 3 + 2]) {
      return this.board[row * 3 + 0];
    }
  }

  // Second, each column:
  for(var col = 0; col < 3; col++) {
    if(this.board[0 * 3 + col] === Game.EMPTY_CELL) {
      continue;
    }

    if(this.board[0 * 3 + col] === this.board[1 * 3 + col] &&
       this.board[0 * 3 + col] === this.board[2 * 3 + col]) {
      return this.board[0 * 3 + col];
    }
  }

  // Last, each diagonal:
  if(((this.board[4] === this.board[0] && this.board[4] === this.board[8]) ||
      (this.board[4] === this.board[2] && this.board[4] === this.board[6])) &&
     this.board[4] !== Game.EMPTY_CELL) {
    return this.board[4];
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
