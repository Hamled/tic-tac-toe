import Game from 'game';

describe('Game', function() {
  beforeEach(function() {
    this.playerX = 'Player X';
    this.playerO = 'Player O';
    this.create = function() {
      return new Game(this.playerX, this.playerO);
    };
  });

  describe('.constructor', function() {
    it('can be called', function() {
      expect(Game).toBeFunction();
    });

    it('thows an Error when not given two player names', function() {
      expect(function() {
        return new Game();
      }).toThrowError(Error, 'Game must be given two player names');

      expect(function() {
        return new Game('Player X');
      }).toThrowError(Error, 'Game must be given two player names');

      expect(function() {
        return new Game('Player X', 'Player O');
      }).not.toThrow();
    });

    it('sets the player names', function() {
      const playerX = 'Player X';
      const playerO = 'Player O';
      var game = new Game(playerX, playerO);

      expect(game.playerX).toEqual(playerX);
      expect(game.playerO).toEqual(playerO);
    });

    it('sets turn count to be 1', function() {
      var game = this.create();

      expect(game.turn).toEqual(1);
    });

    it('starts with an empty board', function() {
      var game = this.create();

      game.board.forEach(function(cell) {
        expect(cell).toEqual(Game.EMPTY_CELL);
      });
    });
  });

  describe('#currentPlayer', function() {
    it('can be called', function() {
      var game = this.create();

      expect(game.currentPlayer).toBeFunction();
    });

    it('starts with X player', function() {
      var game = this.create();

      expect(game.currentPlayer()).toEqual(this.playerX);
    });

    it('alternates between players on each turn', function() {
      var game = this.create();

      while(game.turn <= Game.LAST_TURN) {
        expect(game.currentPlayer()).toEqual(this.playerX);
        game.turn += 1;
        expect(game.currentPlayer()).toEqual(this.playerO);
        game.turn += 1;
      }
    });
  });

  describe('#play', function() {
    it('can be called', function() {
      var game = this.create();

      expect(game.play).toBeFunction();
    });

    it('throws an Error when not given a valid position argument', function() {
      var game = this.create();

      var invalidArgs = {
        empty: [],
        notANumber: ['Not A Number'],
        notInteger: [1.5],
        outOfRangeMin: [Game.BOARD_POS_MIN - 1],
        outOfRangeMax: [Game.BOARD_POS_MAX + 1]
      };

      Object.values(invalidArgs).forEach(function(args) {
        expect(function() {
          return game.play.apply(game, args);
        }).toThrowError(Error, 'play() requires a valid board cell position');
      });
    });

    const validPosition = Game.BOARD_POS_MIN;

    it('increments the turn count', function() {
      var game = this.create();
      var originalTurn = game.turn;

      game.play(validPosition);

      expect(game.turn).toEqual(originalTurn + 1);
    });

    it('throws an Error when maximum turns have been reached', function() {
      var game = this.create();
      game.turn = Game.LAST_TURN + 1; // The + 1 means last turn has been played

      expect(function() {
        return game.play(validPosition);
      }).toThrowError(Error, 'Cannot play because game is already completed');
    });

    it('sets the board cell at the given position to the current player\'s mark', function() {
      var game = this.create();

      // This results in a game that ends with an X win on the final turn (full board)
      const playPositions = [0, 1, 3, 2, 4, 5, 7, 6, 8];
      playPositions.forEach(function(position) {
        const currentPlayer = game.currentPlayer();
        game.play(position);

        expect(game.boardAt(position)).toEqual(game.playerMark(currentPlayer));
      });
    });

    it('throws an Error when attempting to play in a marked cell', function() {
      var game = this.create();

      game.play(validPosition);

      expect(function() {
        return game.play(validPosition);
      }).toThrowError(Error, 'Cannot play because that position is already marked');
    });

    it('throws an Error when attempting to play after game has been won', function() {
      var game = this.create();

      const playPositions = [0, 2, 3, 5, 6];
      playPositions.forEach(function(position) {
        game.play(position);
      });

      expect(function() {
        return game.play(8);
      }).toThrowError(Error, 'Cannot play because game is already completed');
    });
  });

  describe('#outcome', function() {
    beforeEach(function() {
      this.game = this.create();

      this.expectOutcome = function(positions, expected) {
        var game = this.game;
        positions.forEach(function(position) {
          game.play(position);
        });

        expect(game.outcome()).toEqual(expected);
      };
    });

    it('can be called', function() {
      expect(this.game.outcome).toBeFunction();
    });

    it('returns null if the game is not yet won', function() {
      expect(this.game.outcome()).toBeNull();

      const playPositions = [0, 4, 2, 1, 7, 3, 5, 8];

      this.expectOutcome(playPositions, null);
    });

    it('returns EMPTY_CELL if the game is a tie', function() {
      const playPositions = [0, 4, 2, 1, 7, 3, 5, 8, 6];

      // Sanity check
      expect(new Set(playPositions).size).toEqual(Game.LAST_TURN);

      this.expectOutcome(playPositions, Game.EMPTY_CELL);
    });

    it('returns X if game has been won by player X (partial board)', function() {
      const playPositions = [0, 2, 3, 4, 6];

      this.expectOutcome(playPositions, this.game.playerMark(this.game.playerX));
    });

    it('returns X if game has been won by player X (full board)', function() {
      const playPositions = [0, 1, 3, 2, 4, 5, 7, 6, 8];

      this.expectOutcome(playPositions, this.game.playerMark(this.game.playerX));
    });

    it('returns O if game has been won by player O (partial board)', function() {
      const playPositions = [0, 2, 3, 6, 4, 8, 7, 5];

      this.expectOutcome(playPositions, this.game.playerMark(this.game.playerO));
    });
  });

  describe('#boardAt', function() {
    it('can be called', function() {
      var game = this.create();

      expect(game.boardAt).toBeFunction();
    });

    it('throws an Error when not given a valid position argument', function() {
      var game = this.create();

      var invalidArgs = {
        empty: [],
        notANumber: ['Not A Number'],
        notInteger: [1.5],
        outOfRangeMin: [Game.BOARD_POS_MIN - 1],
        outOfRangeMax: [Game.BOARD_POS_MAX + 1]
      };

      Object.values(invalidArgs).forEach(function(args) {
        expect(function() {
          return game.boardAt.apply(game, args);
        }).toThrowError(Error, 'boardAt() requires a valid board cell position');
      });
    });

    it('returns the value from the board cell at the given position', function() {
      var game = this.create();

      // Setup the board with specific values
      // NOTE: This is very implementation-specific code and may break later
      for(var pos = Game.BOARD_POS_MIN; pos <= Game.BOARD_POS_MAX; pos++) {
        game.board[pos] = 'value'+pos;
      }

      // Check that boardAt gives the right value for each
      for(pos = Game.BOARD_POS_MIN; pos <= Game.BOARD_POS_MAX; pos++) {
        expect(game.boardAt(pos)).toEqual('value'+pos);
      }
    });
  });

  describe('#playerMark', function() {
    it('can be called', function() {
      var game = this.create();

      expect(game.playerMark).toBeFunction();
    });

    it('throws an Error when not given one of the game\'s players', function() {
      var game = this.create();

      const notAPlayer = 'Not A Player';
      // Sanity check
      expect(notAPlayer).not.toEqual(game.playerX);
      expect(notAPlayer).not.toEqual(game.playerO);

      expect(function() {
        return game.playerMark(notAPlayer);
      }).toThrowError(Error, `${notAPlayer} is not one of the game's players`);
    });

    it('returns X for the player using X', function() {
      var game = this.create();

      expect(game.playerMark(this.playerX)).toEqual('X');
    });

    it('returns O for the player using O', function() {
      var game = this.create();

      expect(game.playerMark(this.playerO)).toEqual('O');
    });
  });

  describe('.isValidPosition', function() {
    it('can be called', function() {
      expect(Game.isValidPosition).toBeFunction();
    });

    it('returns false if the given position is invalid', function() {
      var invalidArgs = {
        empty: [],
        notANumber: ['Not A Number'],
        notInteger: [1.5],
        outOfRangeMin: [Game.BOARD_POS_MIN - 1],
        outOfRangeMax: [Game.BOARD_POS_MAX + 1]
      };

      Object.values(invalidArgs).forEach(function(args) {
        expect(Game.isValidPosition.apply(Game, args)).toBeFalsy();
      });
    });

    it('returns true if the given position is valid', function() {
      for(var pos = Game.BOARD_POS_MIN; pos <= Game.BOARD_POS_MAX; pos++) {
        expect(Game.isValidPosition(pos)).toBeTruthy();
      }
    });
  });
});
