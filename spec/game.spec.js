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
  });
});
