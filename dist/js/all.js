(function() {
  "use strict";

  exports.apiKey = process.env.GOOGLE_PLACES_API_KEY || "AIzaSyBeDnT9G9IMIFxH9jjTUxmzSKwfForVk04";
  exports.outputFormat = process.env.GOOGLE_PLACES_OUTPUT_FORMAT || "json";
})();

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
var router = require('./router');
Backbone.LocalStorage = require('backbone.localstorage');

Backbone.View.prototype.close = function() {
  console.log('Closing view ' + this);

  if (this.beforeClose) {
    this.beforeClose();
  }

  this.remove();
  this.unbind();
};

$('body').on('click', '.back-button', function(event) {
  event.preventDefault();
  window.history.back();
});
// Backbone.history.start({pushState: true, root: '/'});
Backbone.history.start();


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
    this.showView('.content', eventView);
    this.eventList();
    // this.signInUser();
    this.setUpEventView(eventView);
  },
  setUpEventView: function(eventView) {
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

	// Here we set up click event on list menu icon to show and hide event list
    var menuIcon = $('.menu-icon-link');
    menuIcon.on('click', function(event) {
      event.preventDefault(); // Prevent form submission and contact with server
      event.stopPropagation();
      $('.container-flex').toggleClass('menu-hidden');
    });

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

'use strict';
/* global require, module, google, document, navigator */
var $ = require('jquery');
var Handlebars = require('handlebars');
var Backbone = require('backbone');
Backbone.$ = $;
var Events = require('../collections/events');
var GoogleMapsLoader = require('google-maps');
var ArbitratorConfig = require('../config');

module.exports = Backbone.View.extend({

  tagName: 'section',

  className: 'layout vertical polymer-main',

  initialize: function(model, options) {
    this.router = options.router;
    this.listenTo(this.model, 'change', this.render);
  },

  template: Handlebars.compile($('#tpl_event').html()),

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));

    return this.el;
  },
  events: {
    'click #save': 'save',
    'click .delete': 'delete',
    'click #new': 'newEvent'
  },

  newEvent: function() {
    console.log('newEvent');
    var urlPath = 'events/new';

    /* eslint-disable  no-negated-condition */
    if (!Backbone.history.navigate(urlPath, true)) {
      Backbone.history.loadUrl();
    } else {
      this.router.navigate(urlPath, {trigger: true});
    }

    return false;
  },
  save: function(e) {
    e.preventDefault();

    if ($('#start').val() > $('#end').val()) {
      $('#end').attr('error-message', 'Kindly ensure that your start date and time is before the end date and time.');
      $('#end').trigger('focus');
      return;
    }

    this.model.set({
      name: $('#name').val(),
      description: $('#description').val(),
      type: $('#type').val(),
      host: $('#host').val(),
      start: $('#start').val(),
      end: $('#end').val(),
      guests: $('#guests').val(),
      address: $('#address').val(),
      message: $('#message').val()

    });

    if (this.model.isNew()) {
      var _this = this;
      Events.create(this.model, {
        wait: true,    // waits for server to respond with 200 before adding newly created model to collection
        success: function() {
          // Navigate to project details to allow editing or deleting of project
          _this.router.navigate('events/' + _this.model.id, {trigger: true});
        },
        error: function(err) {
          console.log('error callback');
          // this error message for dev only
          console.log('There was an error. See console for details');
          console.log(err);
          console.log('err');
        }

      });
    } else {
      this.model.save();
    }
    return false;
  },

  delete: function() {
    this.model.destroy({
      success: function() {
        Events.fetch({reset: true});
        if (Events.length > 0) {
          var last = Events.length - 1;
          this.router.navigate('events/' + Events.at(last).id, {trigger: true});
        } else {
          this.router.navigate('events/new', {trigger: true});
        }
      }
    });
    return false;
  },
  autocomplete: null,

  initAutocomplete: function() {
    var _this = this;

    // The geocode type restricts the search to geographical location types.
    GoogleMapsLoader.KEY = ArbitratorConfig.apiKey;
    GoogleMapsLoader.LIBRARIES = ['places'];
    GoogleMapsLoader.SENSOR = false;

    GoogleMapsLoader.load(function(google) {
      // Create the autocomplete object, restricting the search to geographical
      // location types.
      _this.autocomplete = new google.maps.places.Autocomplete(
      (document.getElementById('address').$.input),
      {types: ['geocode']});
      // When the user selects an address from the dropdown, populate the address
      // fields in the form.
      // this.autocomplete.addListener('place_changed', this.fillInAddress);
      google.maps.event.addListener(_this.autocomplete, 'place_changed', function() {
        // Get the place details from the autocomplete object.
        var place = _this.autocomplete.getPlace();

        // Get each component of the address from the place detail
        // and fill the corresponding field on the form.
        for (var i = 0; i < place.address_components.length; i++) {
          var addressType = place.address_components[i].types[0];
          if (_this.componentForm[addressType]) {
            var val = place.address_components[i][_this.componentForm[addressType]];
            _this.fullAddress[addressType] = val;
          }
        }
      });
    });
  },

  componentForm: {streetNumber: 'short_name',
  route: 'long_name',
  locality: 'long_name',
    administrativeAreaLevel1: 'short_name',
    country: 'long_name',
    postalCode: 'short_name'},

  fullAddress: {},

  fillInAddress: function() {
    // Get the place details from the autocomplete object.
    var place = this.autocomplete.getPlace();

    // Get each component of the address from the place details
    // and fill the corresponding field on the form.
    for (var i = 0; i < place.addressComponents.length; i++) {
      var addressType = place.addressComponents[i].types[0];

      if (this.componentForm[addressType]) {
        var val = place.addressComponents[i][this.componentForm[addressType]];
        this.fullAddress[addressType] = val;
      }
    }
  },

  // as supplied by the browser's 'navigator.geolocation' object.
  geolocate: function() {
    var _this = this;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        var circle = new google.maps.Circle({
          center: geolocation,
          radius: position.coords.accuracy
        });
        _this.autocomplete.setBounds(circle.getBounds());
      });
    }
  }
});

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

'use strict';
/* global require, module */
var $ = require('jquery');
var Handlebars = require('handlebars');
var Backbone = require('backbone');
Backbone.$ = $;
global.jQuery = require('jquery');
require("bootstrap");

module.exports = Backbone.View.extend({
	// tagName: nav,

	// className: 'navBar',

  initialize: function(options) {
    this.router = options.router;
  },

  template: Handlebars.compile($('#tpl_nav').html()),

  render: function() {
    $(this.el).html(this.template());

    return this.el;
  }

});


'use strict';
/* global require, module */
var $ = require('jquery');
var Handlebars = require('handlebars');
var Backbone = require('backbone');
Backbone.$ = $;

module.exports = Backbone.View.extend({
  tagName: 'section',

  className: 'row shell-view main',

  initialize: function() {

  },

  template: Handlebars.compile($('#tpl_shell').html()),

  render: function() {
    $(this.el).html(this.template());
    return this.el;
  }
});

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

'use strict';
/* global google, document, navigator, require, module*/
var $ = require('jquery');
var Handlebars = require('handlebars');
var Backbone = require('backbone');
Backbone.$ = $;
var Users = require('../collections/users');
var GoogleMapsLoader = require('google-maps');
var ArbitratorConfig = require('../config');

module.exports = Backbone.View.extend({

  tagName: 'section',

  className: 'layout vertical polymer-main main',

  initialize: function(model, options) {
    this.router = options.router;
    this.listenTo(this.model, 'change', this.render);
  },
  autocomplete: null,
  initAutocomplete: function() {
    var _this = this;

    // The geocode type restricts the search to geographical location types.
    GoogleMapsLoader.KEY = ArbitratorConfig.apiKey;
    GoogleMapsLoader.LIBRARIES = ['places'];
    GoogleMapsLoader.SENSOR = false;

    GoogleMapsLoader.load(function(google) {
      // Create the autocomplete object, restricting the search to geographical
      // location types.
      _this.autocomplete = new google.maps.places.Autocomplete(
      (document.getElementById('address').$.input),
      {types: ['geocode']});
      // When the user selects an address from the dropdown, populate the address
      // fields in the form.
      // this.autocomplete.addListener('place_changed', this.fillInAddress);
      google.maps.event.addListener(_this.autocomplete, 'place_changed', function() {
        // Get the place details from the autocomplete object.
        var place = _this.autocomplete.getPlace();

        // Get each component of the address from the place detail
        // and fill the corresponding field on the form.
        for (var i = 0; i < place.address_components.length; i++) {
          var addressType = place.address_components[i].types[0];
          if (_this.componentForm[addressType]) {
            var val = place.address_components[i][_this.componentForm[addressType]];
            _this.fullAddress[addressType] = val;
          }
        }
      });
    });
  },

  componentForm: {streetNumber: 'short_name',
  route: 'long_name',
  locality: 'long_name',
    administrativeAreaLevel1: 'short_name',
    country: 'long_name',
    postalCode: 'short_name'},

  fullAddress: {},

  fillInAddress: function() {
    // Get the place details from the autocomplete object.
    var place = this.autocomplete.getPlace();

    // Get each component of the address from the place details
    // and fill the corresponding field on the form.
    for (var i = 0; i < place.addressComponents.length; i++) {
      var addressType = place.addressComponents[i].types[0];

      if (this.componentForm[addressType]) {
        var val = place.addressComponents[i][this.componentForm[addressType]];
        this.fullAddress[addressType] = val;
      }
    }
  },

  // as supplied by the browser's 'navigator.geolocation' object.
  geolocate: function() {
    var _this = this;
    console.log('geolocate');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        var circle = new google.maps.Circle({
          center: geolocation,
          radius: position.coords.accuracy
        });
        _this.autocomplete.setBounds(circle.getBounds());
      });
    }
  },

  template: Handlebars.compile($('#tpl_signUp').html()),

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));

    return this.el;
  },

  events: {
    'click #submit': 'submit'
  },

  submit: function() {
    if ($('#password').val() !== $('#passwordConfirm').val()) {
      $('#passwordConfirm').attr('invalid', 'true');
      $('#passwordConfirm').attr('error-message', 'Kindly ensure passwords match.');
      $('#passwordConfirm').trigger('focus');
      return;
    }

    this.model.set({
      name: $('#name').val(),
      email: $('#email').val(),
      password: $('#password').val()
    });

    if (this.model.isNew()) {
      var _this = this;
      Users.create(this.model, {
        wait: true,    // waits for server to respond with 200 before adding newly created model to collection
        success: function() {
          _this.router.navigate('', {trigger: true});
        },
        error: function(err) {
          // this error message for dev only
          console.log('There was an error. See console for details');
          console.log(err);
          console.log('err');
        }

      });
    } else {
      this.model.save();
    }
    return false;
  }
});
