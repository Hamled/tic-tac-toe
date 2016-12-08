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
      var game = new Game('Player X', 'Player O');

      expect(game.turn).toEqual(1);
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
