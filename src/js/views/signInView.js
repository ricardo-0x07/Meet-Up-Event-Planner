'use strict';
/* global require, module */
var $ = require('jquery');
var Handlebars = require('handlebars');
var Backbone = require('backbone');
Backbone.$ = $;
var Users = require('../collections/users');

module.exports = Backbone.View.extend({

  tagName: 'section',

  className: 'layout vertical polymer-main main',

  initialize: function(model, options) {
    // console.log('options: ');
    // console.log(options);
    // this.model = options.router;
    this.router = options.router;
    console.log('XXthis: ');
    console.log(this);
    this.listenTo(this.model, 'change', this.render);
  },

  template: Handlebars.compile($('#tpl_signIn').html()),

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));

    return this.el;
  },
  events: {
    'click .loginButton': 'submit',
    'click #signUpButton': 'signUp'
  },

  loggedInUser: null,
  signUp: function() {
    this.router.navigate('signUp', {trigger: true});
  },
  submit: function() {
    Users.fetch({reset: true});
    console.log('Users.toJSON(): ');
    console.log(Users.toJSON());
    var formValues = {
      email: $('#email').val(),
      password: $('#password').val()
    };
    this.model = Users.findWhere(formValues);

    if (this.model === null || typeof this.model ===	'undefined') {
      $('#email').attr('invalid', 'true');
      $('#email').attr('error-message', 'Kindly verify you have entered the correct email.');
      $('#email').trigger('focus');

      $('#password').attr('invalid', 'true');
      $('#password').attr('error-message', 'Kindly verify you have entered the correct password.');
      return;
    }
    console.log('this:');
    console.log(this);
    this.router.loggedInUser = this.model;
    this.router.signInUser();
    var urlPath = 'events/new';

    /* eslint-disable  no-negated-condition */
    if (!Backbone.history.navigate(urlPath, true)) {
      Backbone.history.loadUrl();
    } else {
      this.router.navigate(urlPath, {trigger: true});
    }
  }
});
