'use strict';
/* global require, module */
var $ = require('jquery');
var Handlebars = require('handlebars');
var Backbone = require('backbone');
Backbone.$ = $;
var Events = require('../collections/events');
var EventSummaryView = require('./eventSummaryView');

module.exports = Backbone.View.extend({
  tagName: 'div',

  className: 'event_list_view layout vertical',

  initialize: function(model, options) {
    // console.log('options: ');
    // console.log(options);
    this.options = options;
    this.listenTo(Events, 'change', this.render);
    this.listenTo(Events, 'add', this.addOne, this);
    this.listenTo(Events, 'reset', this.render);
  },

  template: Handlebars.compile($('#tpl_aside').html()),

  render: function() {
    var _this = this;
    $(this.el).html(this.template);
    Events.each(this.addOne, this);
    this.$list = $('.event_list');

    $('paper-input.filter').on('keyup', function() {
      var filter = this.value;
      console.log('filter: ');
      console.log(filter);
      if (filter) {
        $('.event_list').html('');
        _this.filterList(filter);
      }
    });
    return this.el;
  },

  addOne: function(event) {
    // var _this = this;
    console.log('In addOne');
    console.log(event.get('name') + 'added');
    var eventSummaryView = new EventSummaryView({model: event}, this.options);
    $('.event_list').prepend(eventSummaryView.render());
  },
  // Add all items in the **event** collection at once.
  addAll: function() {
    this.$list.html('');
    Events.each(this.addOne, this);
  },
  filterList: function(filter) {
    var _this = this;
    Events.forEach(function(model) {
      var eventName = model.get('name');

      if (eventName.toLowerCase().indexOf(filter) !== -1) {
        _this.addOne(model);
      }
    });
  }
});
