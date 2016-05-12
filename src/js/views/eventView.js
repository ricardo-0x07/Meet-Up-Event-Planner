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
