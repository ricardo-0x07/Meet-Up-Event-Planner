 /* global module, require, console */
'use strict';

var $ = require('jquery');// (window);
var Backbone = require('backbone');
Backbone.$ = $;

module.exports = Backbone.Model.extend({
  urlRoot: '/User',
  defaults: {
    name: '',
    email: '',
    password: ''
  },
  initialize: function() {
    console.log('A model instance named ' +
    this.get('name') + ' has been created.');
  }
});

