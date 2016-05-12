'use strict';
/* global require, module */
var $ = require('jquery');
var Handlebars = require('handlebars');
var Backbone = require('backbone');
Backbone.$ = $;

module.exports = Backbone.View.extend({
  tagName: 'section',

  className: 'row content',

  initialize: function(options) {
    this.router = options.router;
  },

  template: Handlebars.compile($('#tpl_home_marketing').html()),

  render: function() {
    $(this.el).html(this.template());
    return this.el;
  },

  events: {
    'click .signUp': 'signUp',
    'click .signIn': 'signIn'
  },
  signUp: function() {
    this.router.navigate('signUp', {trigger: true});
    // Backbone.history.navigate('signUp', {trigger: true});
  },
  signIn: function() {
    this.router.navigate('signIn', {trigger: true});
    // Backbone.history.navigate('signIn', {trigger: true});
  }
});
