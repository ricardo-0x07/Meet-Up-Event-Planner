'use strict';
/* global require, module, document */
var $ = require('jquery');
var Handlebars = require('handlebars');
var Backbone = require('backbone');
Backbone.$ = $;
var Users = require('../collections/users');

module.exports = Backbone.View.extend({

  tagName: 'section',

  className: 'layout vertical polymer-main main',

  initialize: function(model, options) {
    this.router = options.router;
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
  submit: function(e) {
    // Prevent automatic form submission.
    var $signInPaperCard = $('paper-card#signIn .form-control');
    if (!document.getElementById('signInForm').checkValidity()) {
      e.preventDefault(); // Prevent form submission and contact with server
      e.stopPropagation();
      // List of sign up input fields that will be validated
      $signInPaperCard.each(function(index, element) {
        element.validate();
      });
      return;
    }

    Users.fetch({reset: true});
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
