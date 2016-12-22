import _ from 'underscore';
import Backbone from 'backbone';
import Game from 'app/models/game';
import GameView from 'app/views/game_view';

const ApplicationView = Backbone.View.extend({
  initialize: function(options) {
    this.gameView = new GameView({
      el: this.$('#board')
    });
    this.listenTo(this.gameView, 'restart', this.restart);

    this.setupTemplate = _.template(Backbone.$('#tmpl-setup-form').html());
  },

  render: function() {
    if(this.currentGame) {
      // Remove the setup form
      this.$('.setup-form').remove();

      // Show the game board if we have one
      this.$('#board').show();
      this.gameView.render();
    } else {
      // Show the setup form
      this.$el.append(this.setupTemplate());

      // Make sure we're not showing the board
      this.$('#board').hide();
    }
  },

  newGame: function(playerX, playerO) {
    // Create a new Game model
    this.currentGame = new Game({
      playerX: playerX,
      playerO: playerO
    });

    // Make the game view use it
    this.gameView.setGame(this.currentGame);

    this.render();
  },

  restart: function() {
    delete this.currentGame;
    this.render();
  },

  events: {
    'click .start': 'onStart'
  },

  onStart: function(e) {
    const playerX = this.$('input[name="playerX"]').val();
    const playerO = this.$('input[name="playerO"]').val();

    this.newGame(playerX, playerO);
  }
});

export default ApplicationView;
