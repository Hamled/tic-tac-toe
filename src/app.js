import $ from 'jquery';
import Game from 'app/models/game';
import GameView from 'app/views/game_view';

$(function() {
  const game = new Game({
    playerX: 'Charles',
    playerO: 'Computer'
  });

  const gameView = new GameView({
    el: '#application',
    model: game
  });

  gameView.render();
});
