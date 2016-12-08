const Game = function(playerX, playerO) {
  if(playerX === undefined || playerO === undefined) {
    throw new Error('Game must be given two player names');
  }

  this.playerX = playerX;
  this.playerO = playerO;
  this.turn = 1;
};

// Constants
Game.LAST_TURN = 9;

Game.prototype.currentPlayer = function() {
  return (this.turn % 2 === 0) ? this.playerO
                               : this.playerX;
};

export default Game;
