import Base from 'base';

// Inherit from the Base model instead of Backbone.Model
// this allows us to use the custom overrides from Base.
// Check out base.js for more details.
const Game = Base.extend({
  urlRoot: 'http://localhost:3000/api/v1/games/',

  initialize: function(options) {
    if(!options || options.playerX === undefined || options.playerO === undefined) {
      throw new Error('Game must be given two player names');
    }

    // Create an empty board
    const board = new Array(Game.BOARD_POS_MAX + 1);
    board.fill(Game.EMPTY_CELL);

    // Remove the separate player name attributes
    this.unset('playerX');
    this.unset('playerO');

    // Set all of the attributes for persistence
    this.set({
      players: [
        options.playerX,
        options.playerO
      ],
      outcome: this.outcome,
      board: board,
      played_at: new Date() // Played at is the starting date
    });

    // Tracking turns happens behind the scenes and is not an attribute
    this.turn = 1;
  },

  // Instance Methods
  playerX: function() {
    return this.get('players')[0];
  },

  playerO: function() {
    return this.get('players')[1];
  },

  currentPlayer: function() {
    return (this.turn % 2 === 0) ? this.playerO()
                                : this.playerX();
  },

  play: function(position) {
    if(!Game.isValidPosition(position)) {
      throw new Error('play() requires a valid board cell position');
    }

    if(this.turn > Game.LAST_TURN || this.outcome() !== null) {
      throw new Error('Cannot play because game is already completed');
    }

    if(this.boardAt(position) !== Game.EMPTY_CELL) {
      throw new Error('Cannot play because that position is already marked');
    }

    this.get('board')[position] = this.playerMark(this.currentPlayer());
    this.trigger('change:board', this);
    this.trigger('change', this);

    this.turn++;
  },

  outcome: function() {
    var self = this;
    var isWin = function(pos1, pos2, pos3) {
      return self.boardAt(pos1) === self.boardAt(pos2) &&
            self.boardAt(pos1) === self.boardAt(pos3) &&
            self.boardAt(pos1) !== Game.EMPTY_CELL;
    };

    // Determine the winner by checking:
    // All win conditions involving cell 0
    if(isWin(0, 1, 2) || isWin(0, 3, 6) || isWin(0, 4, 8)) {
      return this.boardAt(0);
    }

    // All win conditions involving cell 4
    if(isWin(3, 4, 5) || isWin(1, 4, 7) || isWin(2, 4, 6)) {
      return this.boardAt(4);
    }

    // All win conditions involving cell 8
    if(isWin(6, 7, 8) || isWin(2, 5, 8)) {
      return this.boardAt(8);
    }

    // Otherwise, no clear winner. In that case it's a tie
    // only if the board is completely filled.
    var outcome = Game.EMPTY_CELL; // EMPTY_CELL means tie
    this.get('board').forEach(function(cell) {
      if(cell === Game.EMPTY_CELL) {
        outcome = null; // No winner yet
      }
    });

    return outcome;
  },

  boardAt: function(position) {
    if(!Game.isValidPosition(position)) {
      throw new Error('boardAt() requires a valid board cell position');
    }

    return this.get('board')[position];
  },

  playerMark: function(player) {
    if(player === this.playerX()) {
      return 'X';
    } else if(player === this.playerO()) {
      return 'O';
    } else {
      throw new Error(`${player} is not one of the game's players`);
    }
  },

  boardString: function() {
    var self = this;
    var rowString = function(row) {
      var r0 = self.boardAt(row * 3 + 0),
          r1 = self.boardAt(row * 3 + 1),
          r2 = self.boardAt(row * 3 + 2);

      return ` ${r0} | ${r1} | ${r2} \n`;
    };

    var dividerString = function() {
      return '---+---+---\n';
    };

    return (
      rowString(0) +
      dividerString() +
      rowString(1) +
      dividerString() +
      rowString(2));
  },

  printBoard: function() {
    console.log(this.boardString());
  }
}, {

  // Static Methods
  isValidPosition: function(position) {
    return Number.isInteger(position) && (position >= this.BOARD_POS_MIN &&
                                          position <= this.BOARD_POS_MAX);
  },

  // Constants
  LAST_TURN: 9,
  BOARD_POS_MIN: 0,
  BOARD_POS_MAX: 8,
  EMPTY_CELL: ' '
});

export default Game;
