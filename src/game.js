const Game = function(playerX, playerO) {
  if(playerX === undefined || playerO === undefined) {
    throw new Error('Game must be given two player names');
  }
};

export default Game;
