 /* global module, require */
'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
Backbone.LocalStorage = require('backbone.localstorage');
var User = require('../models/user');

var Users = Backbone.Collection.extend({
  url: '/allUsers',
  localStorage: new Backbone.LocalStorage('UserCollection'),
  model: User
});

module.exports = new Users();
