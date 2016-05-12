 /* global module, require, console */
'use strict';
var $ = require('jquery');// (window);
var Backbone = require('backbone');
Backbone.$ = $;

module.exports = Backbone.Model.extend({
  urlRoot: '/Event',
  defaults: {
    name: '',
    description: '',
    type: '',
    host: '',
    start: null,
    end: null,
    guests: [],
    address: '',
    message: ''
  },
  initialize: function() {
    console.log('A model instance named ' +
    this.get('name') + ' has been created.');
  }
});

