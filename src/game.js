import Backbone from 'backbone';

const instanceProps = {};

instanceProps.initialize = function(options) {
  if(!options || options.playerX === undefined || options.playerO === undefined) {
    throw new Error('Game must be given two player names');
  }

  this.playerX = options.playerX;
  this.playerO = options.playerO;
  this.turn = 1;

  this.board = new Array(Game.BOARD_POS_MAX + 1);
  this.board.fill(Game.EMPTY_CELL);
};

// Instance Methods
instanceProps.currentPlayer = function() {
  return (this.turn % 2 === 0) ? this.playerO
                               : this.playerX;
};

instanceProps.play = function(position) {
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

instanceProps.outcome = function() {
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

instanceProps.boardAt = function(position) {
  if(!Game.isValidPosition(position)) {
    throw new Error('boardAt() requires a valid board cell position');
  }

  return this.board[position];
};

instanceProps.playerMark = function(player) {
  if(player === this.playerX) {
    return 'X';
  } else if(player === this.playerO) {
    return 'O';
  } else {
    throw new Error(`${player} is not one of the game's players`);
  }
};

instanceProps.printBoard = function() {
  var board = this.board;
  var printRow = function(row) {
    var r0 = board[row * 3 + 0],
        r1 = board[row * 3 + 1],
        r2 = board[row * 3 + 2];

    console.log(` ${r0} | ${r1} | ${r2} `);
  };

  var printDivider = function() {
    console.log('---+---+---');
  };

  printRow(0);
  printDivider();
  printRow(1);
  printDivider();
  printRow(2);
};

const staticProps = {};

// Static Methods
staticProps.isValidPosition = function(position) {
  return Number.isInteger(position) && (position >= this.BOARD_POS_MIN &&
                                        position <= this.BOARD_POS_MAX);
};

// Constants
staticProps.LAST_TURN = 9;
staticProps.BOARD_POS_MIN = 0;
staticProps.BOARD_POS_MAX = 8;
staticProps.EMPTY_CELL = ' ';

const Game = Backbone.Model.extend(instanceProps, staticProps);
export default Game;
