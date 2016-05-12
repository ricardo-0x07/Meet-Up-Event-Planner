 /* global module, require */
'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
Backbone.LocalStorage = require("backbone.localstorage");
var Event = require('../models/event');

var Events = Backbone.Collection.extend({
  url: '/allEvents',
  localStorage: new Backbone.LocalStorage('EventCollection'),
  model: Event
});

module.exports = new Events();
