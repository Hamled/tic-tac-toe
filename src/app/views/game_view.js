import Backbone from 'backbone';

const GameView = Backbone.View.extend({
  render: function() {
    const placedTiles = this.$('.placed-tiles');

    placedTiles.empty(); // Clear out any tiles we currently have
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
