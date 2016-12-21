import Backbone from 'backbone';

const GameView = Backbone.View.extend({
  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
  },

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
    'click .cell': 'onPlay'
  },

  onPlay: function(e) {
    const cell = e.target;
    const position = this.posFromCell(cell);

    this.model.play(position);
  },

  posFromCell: function(cell) {
    const cellID = this.$(cell).attr('id');
    return Number.parseInt(cellID.replace('cell-', ''));
  }
});

export default GameView;
