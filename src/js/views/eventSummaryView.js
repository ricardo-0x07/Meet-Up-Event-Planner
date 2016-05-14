'use strict';
/* global require, module */
var $ = require('jquery');
var Handlebars = require('handlebars');
var Backbone = require('backbone');
Backbone.$ = $;

module.exports = Backbone.View.extend({
  tagName: 'a',

  className: 'event_summary list-group-item entry',

  // events: {
  //     'click a.event_summary': 'onClick'
  // },

  onClick: function() {
    this.router.navigate('events/' + this.model.id, {trigger: true});
  },

  initialize: function(model, options) {
    this.router = options.router;
    this.listenTo(this.model, 'change', this.render);
  },

  template: Handlebars.compile($('#tpl_event_list_element').html()),

  render: function() {
    var _this = this;
    // Backbone LocalStorage is adding `id` attribute instantly after
    // creating a model.  This causes our ProjectSummaryView to render twice. Once
    // after creating a model and once on `id` change.  We want to
    // filter out the second redundant render, which is caused by this
    // `id` change.  It's known Backbone LocalStorage bug, therefore
    // we've to create a workaround.
    // https://github.com/tastejs/todomvc/issues/469
    if (this.model.changed.id !== undefined) {
      return;
    }

    $(this.el).html(this.template(this.model.toJSON()));

    // TODO set up click event to select project to be edited or deleted
    $(this.el).click(_this, function() {
      $('.shell-view').toggleClass('menu-hidden');
      // console.log('project: '+ _this.model.name +' selected.');
      _this.router.navigate('events/' + _this.model.id, {trigger: true});
    });

    return this.el;
  }
});
