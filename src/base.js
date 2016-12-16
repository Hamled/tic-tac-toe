import _ from 'underscore';
import Backbone from 'backbone';

const Base = Backbone.Model.extend({
  // These two overrides allow subclasses to transparently
  // use "computed attributes".
  // Computed attributes are attributes that are functions,
  // but you want to access them as though they were a
  // variable.

  get: function(attr) {
    const value = Backbone.Model.prototype.get.call(this, attr);
    return _.isFunction(value) ? value.call(this) : value;
  },

  toJSON: function() {
    const self = this;
    const json = Backbone.Model.prototype.toJSON.call(this);
    return _.mapObject(json, function(attr, value) {
      return _.isFunction(value) ? value.call(self) : value;
    });
  },

  // This override skips setting any computed attributes.
  set: function(key, val, options) {
    const self = this;
    const super_set = function(attrs) {
      return Backbone.Model.prototype.set.call(self, attrs, val, options);
    };

    if(!this.attributes) {
      return super_set(key);
    }

    if(typeof key === 'object') {
      const attrs = _.omit(key, function(value, attr) {
        return _.isFunction(self.attributes[attr]);
      });
      return super_set(attrs);
    } else {
      if(!_.isFunction(self.attributes[key])) {
        return super_set(key);
      }
    }
  }
});

export default Base;
