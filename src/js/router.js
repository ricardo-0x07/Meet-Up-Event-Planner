'use strict';

/* jslint browser:true*/
/* eslint-disable no-unused-vars*/
/* global window, $, google, document, ko, Backbone, Handlebars, navigator, require */
/* eslint no-negated-condition: 2*/

var _ = require('underscore');
var Handlebars = require('handlebars');
var options = [];
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var SignUpView = require('./views/signUpView');
var HomeView = require('./views/homeView');
var SignInView = require('./views/signInView');
var EventsListView = require('./views/eventListView');
var EventView = require('./views/eventView');
var ShellView = require('./views/shellView');
var User = require('./models/user');
var Event = require('./models/event');
var Events = require('./collections/events');
var NavView = require('./views/navigationView');

var Router = Backbone.Router.extend({

  initialize: function() {
    options.router = this;
    $('.navBar').html(new NavView(options).render());
    // Here we set up click event on list menu icon to show and hide event list
    var menuIcon = $('.menu-icon-link');
    menuIcon.on('click', function(event) {
      event.preventDefault(); // Prevent form submission and contact with server
      event.stopPropagation();
      console.log('menuIcon clicked');
      $('.shell').toggleClass('menu-hidden');
    });
  },
  routes: {
    '': 'home', // Home view
    'signUp': 'signUp', // SignUp view
    'signIn': 'signIn', // signIn view
    'signOut': 'signOut',
    'events/new': 'newEvent',
    'events/:id': 'eventDetails'
  },

  home: function() {
    this.signOut();
    var homeView = new HomeView(options);
    // $('.shell').html(new HomeView(options).render());
    this.showView('.shell', homeView);
  },
  signOut: function() {
    this.loggedInUser = null;
    $('#loggedInUser').text('');
    $('#signIn').show();
    $('#signUp').show();
    $('#signOut').hide();
    $('.menu-icon-link').hide();
    $('#newEventLink').hide();
    this.signIn();
  },
  signUp: function() {
    this.signOut();
    // Create an instance of sign up view and render
    var signUpView = new SignUpView({
      model: new User()
    }, options);
    // $('.shell').html(signUpView.render());
    this.showView('.shell', signUpView);

    // Set focus to the name field
    document.getElementById('name').$.input.focus();

    // Run load load location autocomplete scripts if not loaded already
    signUpView.initAutocomplete();
    // module.exports = app.signUpView.initAutocomplete;

    // List of sign up input fields that will be validated
    this.$signUpPaperCard = $('paper-card#signUp .form-control');
    // this.formValidation(this.$signUpPaperCard);

    // Here set up to track form completion
    var inputs = [];
    var increment = 100 / this.$signUpPaperCard.length;
    this.$signUpPaperCard.each(function(index, element) {
      console.log('element: ');
      console.log(element);
      inputs.push({element: element, amount: increment});
    });
    this.trackFormProgress(inputs);

    // Prevent automatic form submission.
    document.getElementById('address').addEventListener('focus', function() {
      signUpView.geolocate();
    }, false);

    // Prevent automatic form submission.
    document.getElementById('signUpForm').addEventListener('submit', function(event) {
      event.target.checkValidity();
      event.preventDefault(); // Prevent form submission and contact with server
      event.stopPropagation();
    }, false);

    // Verify that the passwords entered are identical.
    document.getElementById('passwordConfirm').addEventListener('blur', function() {
      if ($('#password').val() !== $('#passwordConfirm').val()) {
        $('#passwordConfirm').attr('invalid', 'true');
        $('#passwordConfirm').attr('error-message', 'Kindly ensure passwords match.');
        $('#passwordConfirm').trigger('focus');
      }
    });
  },

  signIn: function() {
    var _this = this;
    console.log('_this: ');
    console.log(_this);
    // Create an instance of sign in view and render
    var signInView = new SignInView({
      model: new User()}, options);
    // $('.shell').html(signInView.render());
    this.showView('.shell', signInView);

    // Set focus to the email field
    document.getElementById('email').$.input.focus();

    // Prevent automatic form submission.
    document.getElementById('signInForm').addEventListener('submit', function(event) {
      event.target.checkValidity();
      event.preventDefault(); // Prevent form submission and contact with server
      event.stopPropagation();
    }, false);

    // List of sign in input fields that will be validated
    this.$signInPaperCard = $('paper-card#signIn .form-control');
    // this.formValidation(this.$signInPaperCard);

    // Here set up to track form completion
    var inputs = [];
    var increment = 100 / this.$signInPaperCard.length;
    this.$signInPaperCard.each(function(index, element) {
      inputs.push({element: element, amount: increment});
    });
    this.trackFormProgress(inputs);
  },

  eventList: function() {
    // Verify the current user is logged in
    if (this.loggedInUser === null || typeof this.loggedInUser ===	'undefined') {
      console.log('current user is not logged in');
      this.signIn();
      return;
    }

    // Create an instance of the eventList view and render
    var eventsListView = new EventsListView({
      model: Events
    }, options).render();
    $('.sideBar').html(eventsListView);

    // Suppresses 'add' events with {reset: true} and prevents the app view
    // from being re-rendered for every model. Only renders when the 'reset'
    // event is triggered at the end of the fetch.
    Events.fetch({reset: true});
  },

  eventDetails: function(id) {
    // Verify the current user is logged in
    if (this.loggedInUser === null || typeof this.loggedInUser ===	'undefined') {
      console.log('current user is not logged in');
      this.signOut();
      this.signIn();
      return;
    }

    // Suppresses 'add' events with {reset: true} and prevents the app view
    // from being re-rendered for every model. Only renders when the 'reset'
    // event is triggered at the end of the fetch.
    Events.fetch({reset: true});

    // Show selected event details
    var event = Events.get(id);
    var eventView = new EventView({model: event}, options);
    $('.shell').html(new ShellView().render());
    this.eventList();
    this.showView('.content', eventView);
    this.setUpEventView(eventView);
  },

  signInUser: function() {
    var name = this.loggedInUser.get('name');
    console.log(name);
    $('#loggedInUser').text(name);
    $('#signIn').hide();
    $('#signUp').hide();
    $('#signOut').show();
    $('.menu-icon-link').show();
    $('#newEventLink').show();
  },
  newEvent: function() {
    // Verify current user is signed in
    if (this.loggedInUser === null || typeof this.loggedInUser ===	'undefined') {
      console.log('user not logged inXXX');
      this.signOut();
      this.signIn();
      return;
    }
    // Create an instance of the eventView view and render`
    var eventView = new EventView({model: new Event()}, options);
    $('.shell').html(new ShellView().render());
    this.eventList();
    this.showView('.content', eventView);
    this.setUpEventView(eventView);
  },
  setUpEventView: function(eventView) {
    $('.shell').addClass('menu-hidden');

    document.getElementById('name').$.input.focus();
    // List of sign up input fields that will be validated
    this.$eventPaperCard = $('paper-card#event .form-control');

	// Here set up to track form completion
    var inputs = [];
    var increment = 100 / this.$eventPaperCard.length;
    this.$eventPaperCard.each(function(index, element) {
      inputs.push({element: element, amount: increment});
    });
    this.trackFormProgress(inputs);

    // Here we set up date range min constraints for validation
    $('paper-input#start').on('focus', function() {
      var currentDateTime = new Date();
      $('paper-input#start').attr('min', currentDateTime.toLocaleString());
    });
    $('paper-input#start').on('change', function() {
      $('paper-input#end').attr('min', $('paper-input#start').val());
    });

    document.getElementById('address').addEventListener('focus', function() {
      eventView.geolocate();
    }, false);

    // Prevent automatic form submission.
    document.getElementById('eventForm').addEventListener('submit', function(event) {
      event.target.checkValidity();
      event.preventDefault(); // Prevent form submission and contact with server
      event.stopPropagation();
    }, false);

    eventView.initAutocomplete();
  },
  showView: function(selector, view) {
    if (this.currentView) {
      this.currentView.close();
    }

    $(selector).html(view.render());
    this.currentView = view;

    return view;
  },
  formValidation: function(selector) {
    // List of sign up input fields that will be validated
    // this.$signInPaperCard = $('paper-card#signIn .form-control');

    $.fn.validateThis = function() {
      this.on('blur', function() {
        this.validate();
      });
    };

    // Loops through the list and validates inputs that require validation based on the properties set in HTML.
    $.fn.isFieldsetValid = function() {
      this.each(function() {
        $(this).validateThis();
      });
    };

    selector.isFieldsetValid();
  },
  trackFormProgress: function(inputs) {
    console.log('progressBar: ');
    // Set up the logic to change the progress bar
    var progressBar = document.querySelector('paper-progress.transiting');
    console.log(progressBar);
    /** @description Track the progress of the form
    * @param {number} inputs - list of inputs for validation tracking.
    * @param {object} progressBar - progress bar to be updated
    */
    function ProgressTracker(inputs, progressBar) {
      console.log('ProgressTracker');
      var _this = this;
      this.progressBar = progressBar;
      this.inputs = inputs;

      this.inputs.forEach(function(input) {
        input.added = false;
        input.isValid = null;
        input.element.onkeyup = function() {
          console.log('onkeyup');
          this.validate();
          input.isValid = _this.determineStatus(input);
          _this.adjustProgressIfNecessary(input);
        };
        input.element.onblur = function() {
          console.log('onblur');
          this.validate();
          input.isValid = _this.determineStatus(input);
          _this.adjustProgressIfNecessary(input);
        };
      });
    }

    ProgressTracker.prototype = {
      determineStatus: function(input) {
        var isValid = false;

        if (input.element.value.length > 0) {
          isValid = true;
        } else {
          isValid = false;
        }

        try {
          isValid = isValid && input.element.validate();
        } catch (e) {
          console.log(e);
        }

        return isValid;
      },
      adjustProgressIfNecessary: function(input) {
        var newAmount = this.progressBar.value;

        if (input.added && !input.isValid) {
          newAmount -= input.amount;
          input.added = false;
        } else if (!input.added && input.isValid) {
          newAmount += input.amount;
          input.added = true;
          console.log('valid input:');
          console.log(input);
        }

        this.progressBar.value = newAmount;
      }
    };

    /* eslint-disable no-unused-vars*/
    var progressTracker = new ProgressTracker(inputs, progressBar);
  }
});

var _instance;

var SingletonRouter = function() {
  if (_instance === undefined) {
    console.log('_instance undefined');
    _instance = new Router();
  }
  console.log('returning _instance: ');
  console.log(_instance);
  return _instance;
};

module.exports = new SingletonRouter();

