import Backbone from 'backbone';
import Game from 'app/models/game';
import GameView from 'app/views/game_view';

const ApplicationView = Backbone.View.extend({
  initialize: function(options) {
    this.gameView = new GameView({
      el: this.$('#board')
    });

    this.newGame();
  },

  render: function() {
    this.gameView.render();
  },

  newGame: function() {
    // Create a new Game model
    this.currentGame = new Game({
      playerX: 'Charles',
      playerO: 'Computer'
    });

    // Make the game view use it
    this.gameView.setGame(this.currentGame);

    this.render();
  }
});

export default ApplicationView;
