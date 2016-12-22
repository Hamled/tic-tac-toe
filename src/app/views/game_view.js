import _ from 'underscore';
import Backbone from 'backbone';

const GameView = Backbone.View.extend({
  initialize: function() {
    this.msgTemplate = _.template(Backbone.$('#tmpl-overlay-msg').html());
  },

  setGame: function(game) {
    this.model = game;
    this.listenTo(this.model, 'change', this.render);
  },

  render: function() {
    const placedTiles = this.$('.placed-tiles');

    // Clear out any existing content
    placedTiles.empty();
    this.$('.overlay').remove();

    // Draw all of the current tiles
    for(var i = 0; i < 9; i++) {
      const row = Math.floor(i/3),
            col = i%3,
            val = this.model.boardAt(i);

      if(val === ' ') {
        continue;
      }

      placedTiles.append(Backbone.$(`
        <div class="tile" data-row="r${row}" data-col="c${col}" data-val="${val}">
          ${val}
        </div>
      `));
    }

    // If the game is over, show that
    const outcome = this.model.get('outcome');
    let message;
    if(outcome === 'X') {
      message = `${this.model.playerX()} has won!`;
    } else if(outcome === 'O') {
      message = `${this.model.playerO()} has won!`;
    } else if(outcome === ' ') {
      message = 'It\'s a draw!';
    }

    if(message !== undefined) {
      this.$el.append(this.msgTemplate({
        message: message,
        showSave: this.model.isNew()
      }));
      this.delegateEvents();
    }
  },

  events: {
    'click .cell': 'onPlay',
    'click .restart': 'onRestart',
    'click .save': 'onSave'
  },

  onPlay: function(e) {
    const cell = e.target;
    const position = this.posFromCell(cell);

    this.model.play(position);
  },

  posFromCell: function(cell) {
    const cellID = this.$(cell).attr('id');
    return Number.parseInt(cellID.replace('cell-', ''));
  },

  onRestart: function(e) {
    this.trigger('restart');
  },

  onSave: function(e) {
    const self = this;
    this.model.save().done(function() {
      self.render();
    });
  }
});

export default GameView;
