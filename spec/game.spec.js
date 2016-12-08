import Game from 'game';

describe('Game', function() {
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
});
