import Game from 'game';

describe('Game', function() {
  describe('.constructor', function() {
    it('can be called', function() {
      expect(Game).toBeFunction();
    });
  });
});
