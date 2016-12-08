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
});
