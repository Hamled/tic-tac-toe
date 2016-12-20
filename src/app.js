import $ from 'jquery';
import Game from 'app/models/game';
import GameView from 'app/views/game_view';

$(function() {
  const game = new Game({
    id: 1,
    playerX: 'Charles',
    playerO: 'Computer'
  });

  const gameView = new GameView({
    el: '#application',
    model: game
  });

  game.fetch().done(function() {
    gameView.render();
  });
});
