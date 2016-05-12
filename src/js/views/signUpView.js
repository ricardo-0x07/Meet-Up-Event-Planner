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
