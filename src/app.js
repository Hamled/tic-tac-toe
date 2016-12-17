import $ from 'jquery';
import Backbone from 'backbone';
import Game from 'game';

const GameView = Backbone.View.extend({
  render: function() {
    this.$el.html(`
      <pre>${this.model.boardString()}</pre>
      <input type="text" name="position">
      <button>Play</button>`);

    this.delegateEvents();
  },

  events: {
    'click button': 'onPlay'
  },

  onPlay: function(e) {
    var pos = this.$('input').val();
    this.model.play(Number.parseInt(pos));
    this.render();
  }
});

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
