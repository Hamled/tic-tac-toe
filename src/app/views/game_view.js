import Backbone from 'backbone';

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

export default GameView;
