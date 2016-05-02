// Namespace our app
var app = app || {};

app.Company = Backbone.RelationalModel.extend({
	urlRoot: '/company',
	// localStorage: true,

	relations: [
		{
			type: 'HasMany',
			key: 'projects',
			relatedModel: 'app.Project',
			includeInJSON: Backbone.Model.prototype.idAttribute,
			collectionType: 'app.ProjectCollection',
			reverseRelation: {
				key: 'owner'
			}
		},
		{
			type: 'HasMany',
			key: 'contracts',
			relatedModel: 'app.Project',
			includeInJSON: Backbone.Model.prototype.idAttribute,
			collectionType: 'app.ProjectCollection',
			reverseRelation: {
				key: 'vendor'
			}
		},
		{
			type: 'HasMany',
			key: 'jobs',
			relatedModel: 'app.Job',
			includeInJSON: Backbone.Model.prototype.idAttribute,
			collectionType: 'JobCollection',
			reverseRelation: {
				key: 'company'
			}
		},
		{
			type: 'HasMany',
			key: 'employees',
			relatedModel: 'app.Person',
			includeInJSON: Backbone.Model.prototype.idAttribute,
			collectionType: 'PersonCollection',
			reverseRelation: {
				key: 'employer'
			}
		}


	],


  defaults: {
    name: "",
    url: "",
    email:"",
    contact:"",
    cellPhone:"",
    officePhone:"",
    fax:"",
    streetAddress:"",
    city:"",
    country:"",
    category:""

  }

});
// A link object between 'Person' and 'Company'
app.Job = Backbone.RelationalModel.extend({
	urlRoot: '/Job',
	// localStorage: true,

	defaults: {
		'name':'',
		'startDate': null,
		'endDate': null
	}
});

// Backbone.Relational.store.add({ Job : app.Job });

app.Performance = Backbone.RelationalModel.extend({

	urlRoot: '/Performance',
	// localStorage: true,

	relations: [
		{ // Create a one-to-one relationship
			type: Backbone.HasOne,
			key: 'project',
			relatedModel: 'app.Project',
			reverseRelation: {
				type: Backbone.HasOne,
				key: 'performance'
			}
		},
		{ // Create a one-to-one relationship
			type: Backbone.HasOne,
			key: 'job',
			relatedModel: 'app.Job',
			reverseRelation: {
				type: Backbone.HasOne,
				key: 'performance'
			}
		},
		{ // Create a one-to-one relationship
			type: Backbone.HasOne,
			key: 'evaluator',
			relatedModel: 'app.Person',
			reverseRelation: {
				key: 'evaluations'
			}
		}
	],
	defaults: {
		'rework': '',
		'spi': '',
		'cpi': '',
		'variationclaims': '',
		'valueOfVariationclaims': '',
	},
	initialize: function() {
		// do whatever you want :)
	}
});


app.Person = Backbone.RelationalModel.extend({
    urlRoot: '/Person',
    // localStorage: true,

    relations: [
        // {
        //     type: 'HasMany',
        //     key: 'projects',
        //     relatedModel: 'Project',
        //     includeInJSON: Backbone.Model.prototype.idAttribute,
        //     collectionType: 'ProjectCollection',
        //     reverseRelation: {
        //         key: 'person'
        //     }
        // },
        {
            type: 'HasMany',
            key: 'jobs',
            relatedModel: 'app.Job',
            includeInJSON: Backbone.Model.prototype.idAttribute,
            collectionType: 'app.JobCollection',
            reverseRelation: {
                key: 'person'
            }
        }

    ],

    defaults: {
        name: "",
        email:"",
        contact:"",
        cellPhone:"",
        officePhone:"",
        fax:"",
        fullAddress:"",
        streetAddress:"",
        city:"",
        country:"",
        gender:"",
        profession:"",
        position:"",
        skill:"",
        password:""
    },
    initialize: function() {
        console.log('A model instance named '+ this.get('name') +' has been created.');
    },
    validation: {
        name: {
            required: true,
            msg: 'Please enter an your full name.'
        },
        'email': {
            required: true,
            msg: 'Please enter your email address (company issued).'
        },
        'password': {
            required: true,
            msg: 'Please enter a password.'
        },
        'employer.name': {
            required: true,
            msg: 'Please select your current employer.'
        }
    }


});


// Namespace our app
// var app = app || {};

app.Project = Backbone.RelationalModel.extend({
    urlRoot: '/Project',
    // localStorage: true,


    relations: [
        // {
        // type: 'HasOne',
        // key: 'contractor',
        // relatedModel: 'app.Company',
        // includeInJSON: Backbone.Model.prototype.idAttribute,
        // reverseRelation: {
        //     key: 'doneBy'
        //     }
        // },
        // {
        //     type: 'HasOne',
        //     key: 'customer',
        //     relatedModel: 'app.Company',
        //     includeInJSON: Backbone.Model.prototype.idAttribute,
        //     reverseRelation: {
        //         key: 'doneFor'
        //     }
        // },
        // {
        //     type: 'HasOne',
        //     key: 'service',
        //     relatedModel: 'Service',
        //     includeInJSON: Backbone.Model.prototype.idAttribute,
        //     reverseRelation: {
        //         key: 'project'
        //     }
        // },
        // {
        //     type: 'HasOne',
        //     key: 'inHouseTeam',
        //     relatedModel: 'Person',
        //     includeInJSON: Backbone.Model.prototype.idAttribute,
        //     collectionType: 'PersonCollection',
        //     reverseRelation: {
        //         key: 'project'
        //     }
        // },
        // {
        //     type: 'HasOne',
        //     key: 'outsourcedTeam',
        //     relatedModel: 'Person',
        //     includeInJSON: Backbone.Model.prototype.idAttribute,
        //     collectionType: 'PersonCollection',
        //     reverseRelation: {
        //         key: 'job'
        //     }
        // },
        {
            type: 'HasMany',
            key: 'jobs',
            relatedModecompletedl: 'app.Job',
            includeInJSON: Backbone.Model.prototype.idAttribute,
            collectionType: 'app.JobCollection',
            reverseRelation: {
                key: 'project'
            }
        }
    ],

    defaults: {
        name: "",
        description: "",
        plannedStart:"",
        actualStart:"",
        duration:"",
        plannedFinish:"",
        actualFinish:"",
        lead:"",
        contractorLead:"",
        value:null,
        score:null,
        completed:false,
        evaluated: false
    },
    triggerCustomEvent: function() {
        this.trigger('customEvent');
    },
    validation: {
        name: {
            required: true,
            msg: 'Please enter an project name.'
        },
        'plannedStartDate': {
            required: true,
            msg: 'Please select a start date for the Project.'
        },
        'duration': {
            required: true,
            msg: 'Please enter estimated duration in calender days for the project.'
        },
        'service.name': {
            required: true,
            msg: 'Please select the service required by your project.'
        }
    }
});
// Namespace our app
// var app = app || {};

app.Service = Backbone.RelationalModel.extend({
    urlRoot: '/Service',
    // localStorage: true,

    relations: [
        {
            type: 'HasMany',
            key: 'projects',
            relatedModel: 'app.Project',
            // includeInJSON: Backbone.Model.prototype.idAttribute,
            collectionType: 'app.ProjectCollection',
            reverseRelation: {
                key: 'service',
                // includeInJSON: Backbone.Model.prototype.idAttribute
            }
        }
    ],

    defaults: {
        name: "",
        description: "",
        industry:"",
        criteria1:"",
        criteria2:"",
        criteria3:"",
        criteria4:"",
        criteria5:""
    }

});

// Namespace our app
// var app = app || {};

// COLLECTIONS
app.JobCollection = Backbone.Collection.extend({
	url: '/allJobs',
	// localStorage: true,
	localStorage: new Backbone.LocalStorage("app.JobCollection"), 
	model: app.Job,
	add: function (object) {
		var self = this;
		if (object !== null) {
			if (Array.isArray(object)) {
				console.log('Array of models:');
				console.log(object);
				object.forEach(function(item) {
					if (!self.findWhere({ name: item.name })) {
						console.log('item: '+ item.name +' added.');
					  Backbone.Collection.prototype.add.call(self, item);
					}
				});			
			} else{
				console.log('model:');
				console.log(object);
				if (!self.findWhere({ name: object.name})) {
					console.log('item: '+ object.name +' added.');
				  Backbone.Collection.prototype.add.call(self, object);
				}
			}
			console.log('self:');
			console.log(self);
		}
	}
});

// Create our global collection.
app.jobs = new app.JobCollection();

app.ProjectCollection = Backbone.Collection.extend({
	url: '/api/allProjects',
	// localStorage: true,
	localStorage: new Backbone.LocalStorage("app.ProjectCollection"), 
	model: app.Project,
	add: function (object) {
		var self = this;
		if (object !== null) {
			if (Array.isArray(object)) {
				console.log('Array of models:');
				console.log(object);
				object.forEach(function(item) {
					if (!self.findWhere({ name: item.name })) {
						console.log('item: '+ item.name +' added.');
					  Backbone.Collection.prototype.add.call(self, item);
					}
				});			
			} else{
				console.log('model:');
				console.log(object);
				if (!self.findWhere({ name: object.name})) {
					console.log('item: '+ object.name +' added.');
				  Backbone.Collection.prototype.add.call(self, object);
				}
			}
			console.log('self:');
			console.log(self);
		}
	}

});

// Create our global collection.
app.projects = new app.ProjectCollection();


app.PersonCollection = Backbone.Collection.extend({
	url: '/allPersons',
	// localStorage: true,
	localStorage: new Backbone.LocalStorage("app.PersonCollection"), 
	model: app.Person,
	add: function (object) {
		var self = this;
		if (object !== null) {
			if (Array.isArray(object)) {
				console.log('Array of models:');
				console.log(object);
				object.forEach(function(item) {
					if (!self.findWhere({ name: item.name })) {
						console.log('item: '+ item.name +' added.');
					  Backbone.Collection.prototype.add.call(self, item);
					}
				});			
			} else{
				console.log('model:');
				console.log(object);
				if (!self.findWhere({ name: object.name})) {
					console.log('item: '+ object.name +' added.');
				  Backbone.Collection.prototype.add.call(self, object);
				}
			}
			console.log('self:');
			console.log(self);
		}
	}
});

// Create our global collection.
app.people = new app.PersonCollection();

app.ServiceCollection = Backbone.Collection.extend({
	url: '/allServices',
	// localStorage: true,
	localStorage: new Backbone.LocalStorage("app.ServiceCollection"), 
	model: app.Service,
	getSuggestions: function() {
		app.serviceSuggestions = [];
		_.each(app.ServiceCollection,function(element, index, list) {
			// console.log(element.name);
			app.serviceSuggestions.push(element.name);
		},this);

		return app.serviceSuggestions;
	  // returns an array of strings that you wish to be the suggestions for this collection
	},
	add: function (object) {
		var self = this;
		if (object !== null) {
			if (Array.isArray(object)) {
				console.log('Array of models:');
				console.log(object);
				object.forEach(function(item) {
					if (!self.findWhere({ name: item.name })) {
						console.log('item: '+ item.name +' added.');
					  Backbone.Collection.prototype.add.call(self, item);
					}
				});			
			} else{
				console.log('model:');
				console.log(object);
				if (!self.findWhere({ name: object.name})) {
					console.log('item: '+ object.name +' added.');
				  Backbone.Collection.prototype.add.call(self, object);
				}
			}
			console.log('self:');
			console.log(self);
		}
	}
});

// Create our global collection.
app.Services = new app.ServiceCollection();

app.CompanyCollection = Backbone.Collection.extend({
	url: '/allCompanies',
	// localStorage: true,
	localStorage: new Backbone.LocalStorage("app.CompanyCollection"), 
	model: app.Company,
	add: function (object) {
		var self = this;
		if (object !== null) {
			if (Array.isArray(object)) {
				console.log('Array of models:');
				console.log(object);
				object.forEach(function(item) {
					if (!self.findWhere({ name: item.name })) {
						console.log('item: '+ item.name +' added.');
					  Backbone.Collection.prototype.add.call(self, item);
					}
				});			
			} else{
				console.log('model:');
				console.log(object);
				if (!self.findWhere({ name: object.name})) {
					console.log('item: '+ object.name +' added.');
				  Backbone.Collection.prototype.add.call(self, object);
				}
			}
			console.log('self:');
			console.log(self);
		}
	}
});

// Create our global collection.
app.companies = new app.CompanyCollection();

// Backbone.LocalStorage.setPrefix('appData');

// Views ///////////////////////////////////////////////////////////////
app.navView = Backbone.View.extend({
	// tagName: nav,

	// className: 'navBar',

    initialize: function(){

			// // Suppresses 'add' events with {reset: true} and prevents the app view
			// // from being re-rendered for every model. Only renders when the 'reset'
			// // event is triggered at the end of the fetch.
			// app.jobs.fetch({reset: true});
			// console.log('app.jobs.toJSON():');
			// // console.log(app.jobs.toJSON());
			// // app.projects.fetch({reset: true});
			// console.log('app.projects.toJSON():');
			// console.log(app.projects.toJSON());
			// app.people.fetch({reset: true});
			// console.log('app.people.toJSON():');
			// console.log(app.people.toJSON());
			// app.Services.fetch({reset: true});
			// console.log('app.Services.toJSON():');
			// console.log(app.Services.toJSON());
			// app.companies.fetch({reset: true});
			// console.log('app.companies.toJSON():');
			// console.log(app.companies.toJSON());
    },

	template: Handlebars.compile($('#tpl_nav').html()),

	render: function() {
		$(this.el).html(this.template());

	    return this.el;
	},

	events: {
		'click .listMyServices': 'listMyServices',
		'click .listMyCustomers': 'listMyCustomers',
		'click .listMyProjects': 'listMyProjects',
		
		'click .serviceSearch': 'serviceSearch',
		'click .customerSearch': 'customerSearch',
		'click .projectSearch': 'projectSearch',

		'click .assessment': 'assessment',
		'click .vendorsByService': 'vendorsByService',
		'click .requestValidation': 'requestValidation',

		'click .newCompany': 'newCompany',
		'click .newProject': 'newProject',
		'click .newService': 'newService',
		'click .newJob': 'newJob',
	},
	listMyServices: function() {
		console.log('listMyServices');
	},

	listMyCustomers: function() {
		console.log('listMyCustomers');
	},

	listMyProjects: function() {
		console.log('listMyProjects');
	},

	serviceSearch: function() {
		console.log('serviceSearch');
	},

	customerSearch: function() {
		console.log('customerSearch');
	},

	projectSearch: function() {
		console.log('projectSearch');
	},

	assessment: function() {
		console.log('assessment');
	},

	vendorsByService: function() {
		console.log('vendorsByService');
	},

	requestValidation: function() {
		console.log('requestValidation');
	},


	newCompany: function() {
		console.log('newCompany');
	},

	newProject: function(event) {
		console.log('newProject');
		var urlPath = "projects/new";

		if (!Backbone.history.navigate(urlPath, true)) {
		      console.log('wow');
		      Backbone.history.loadUrl();

		 } else {
		 	app.sortRouter.navigate(urlPath, {trigger: true});

		 }

		return false;
	},

	newService: function() {
		console.log('newService');
	},

	newJob: function() {
		console.log('newJob');
	},

});

app.homeView = Backbone.View.extend({
	tagName: 'section',

	className: 'row',

    initialize: function(){

    },

	template: Handlebars.compile($('#tpl_home_marketing').html()),

	render: function() {
		$(this.el).html(this.template());

	    return this.el;
	},

	events: {
		'click .signUp': 'signUp',
		'click .signIn': 'signIn',
	},
	signUp: function() {
		console.log('signUp button clicked');
		app.sortRouter.navigate('signUp', {trigger: true});

	},
	signIn: function() {
		console.log('signIn button clicked');
		app.sortRouter.navigate('signIn', {trigger: true});

	}
});

app.shellView = Backbone.View.extend({
	tagName: 'section',

	className: 'row',

    initialize: function(){

    },

	template: Handlebars.compile($('#tpl_shell').html()),

	render: function() {
		$(this.el).html(this.template());

	    return this.el;
	},
});

app.ProjectsListView = Backbone.View.extend({
    tagName: 'div',

    className: 'project_list_view',
    
    initialize: function(){
    	this.$list = $('.project_list');
		this.listenTo(app.projects, 'change', this.render);
		this.listenTo(app.projects, 'add', this.addOne);
		this.listenTo(app.projects, 'reset', this.render);
		// this.listenTo(app.projects, 'all', this.render);
    },

    template: Handlebars.compile($('#tpl_aside').html()),

    render: function() {
    	$(this.el).html(this.template);
    	app.projects.each(this.addOne);

    	return this.el;
    },
    
    addOne: function(project) {
    	// console.log('render_project_summary');
    	// console.log('project: ');
    	// console.log(project);
    	var project_summary_view = new app.ProjectSummaryView({model: project});
    	$('.project_list').prepend(project_summary_view.render());

    },
    // Add all items in the **projects** collection at once.
    addAll: function () {
    	this.$list.html('');
    	app.projects.each(this.addOne, this);
    },

});
    
app.ProjectSummaryView = Backbone.View.extend({
	tagName: 'a',

	className: 'project_summary list-group-item',
	
	// events: {
	//     'click a.project_summary': 'on_click'
	// },

	on_click: function(e) {
		console.log('project: '+ this.model.toJSON().name +' selected.');	
	    app.sortRouter.navigate('projects/'+this.model.id+'', {trigger: true});
	},

	initialize: function(){
		// this.model.bind('reset', this.render, this); 
		// this.listenTo(this.model, 'reset', this.render);
		this.listenTo(this.model, 'change', this.render);


		// return this;
	},

	template: Handlebars.compile($('#tpl_project_list_element').html()),

	render: function() {
		var self = this;
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

		// console.log('this.model: ');
		// console.log(this.model.toJSON());
		// $(this.el).html(this.template(this.model.toJSON()));
		$(this.el).html(this.template(this.model.toJSON()));
		
		// TODO set up click event to select project to be edited or deleted
		$(this.el).click(self.model,function(e) {
			// console.log('project: '+ self.model.name +' selected.');	
			app.sortRouter.navigate('projects/'+self.model.id, {trigger: true});

		});
		
		return this.el;
	}
});

app.ProjectView = Backbone.View.extend({

    tagName: "div",
    // Not required since 'div' is the default if no el or tagName specified

	className: 'row',
	
    initialize: function() {
    	Backbone.Validation.bind(this);
    	console.log('this: ');
    	console.log(this);
    	this.listenTo(this.model, 'change', this.render);
        // this.model.bind("change", this.render, this);
    	this.collectionFetched = false;
    },

	template: Handlebars.compile($('#tpl_project').html()),

    render: function(eventName) {
        this.$el.html(this.template(this.model.toJSON()));

        console.log(this.model.toJSON());
        console.log('project view rendered');

        return this.el;
    },
    events: {
        // "change input": "change",
        "click #saveProject": "saveProject",
        "click .delete": "deleteProject",
        'focus #service': 'getAutocomplete',
        'autocompleteselect' :   'handleFindSelect'
    },

    saveProject: function(e) {
    	e.preventDefault();
    	// console.log('saved clicked');
        this.model.set({
            name: $('#name').val(),
            description: $('#description').val(),
            value: $('#value').val(),
            plannedStartDate: $('#plannedStartDate').val(),
            plannedFinishDate: $('#plannedFinishDate').val(),
            actualStartDate: $('#actualStartDate').val(),
            actualFinishDate: $('#actualFinishDate').val(),


        });
    	if (this.model.validate()) {
    		
    	}
        // console.log('this.: ');
        // console.log(this);
        if (this.model.isNew()) {
        	// console.log(this.model);
            var self = this;
            app.ProjectTestModel = app.projects.create(this.model, {
            	wait : true,    // waits for server to respond with 200 before adding newly created model to collection
                success: function() {
                	// console.log('project saved');
                	// Navigate to project details to allow editing or deleting of project
                    app.sortRouter.navigate('projects/' + self.model.id, {trigger: true});
                },
                error : function(err) {
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
		// Test for validation errors from saving a new project
        if (app.ProjectTestModel.validationError) {
        	console.log('model.validationError:');
        	console.log(app.ProjectTestModel.validationError);
        }
        return false;
    },

    deleteProject: function() {
        this.model.destroy({
            success: function() {
                console.log('Project deleted successfully');
                app.projects.fetch({reset: true});
            if (app.projects.length >0) {
                var last = app.projects.length -1;
                app.sortRouter.navigate('projects/' + app.projects.at(last).id, {trigger: true});

            } else {
            	app.sortRouter.navigate('projects/new', {trigger: true});

                // window.history.back();
            }
            }
        });
        return false;
    },
    fetchCollection: function() {
        // if (this.collectionFetched) return;

        app.Services.fetch({reset: true});
    },
    getServiceSuggestions: function() {
    	var serviceSuggestions = [];
    	if (app.Services.length === 0) {
    		this.fetchCollection();
    	}
    	app.Services.each(function(element) {
    		console.log(element.attributes.name);
    		 serviceSuggestions.push(element.attributes.name);
    	});

    	return serviceSuggestions;
    },
    getAutocomplete: function () {
    	var data = app.Services.toJSON();
    	console.log(data);


        $("#service").autocomplete({
          source: this.getServiceSuggestions()
        });
    },
    handleFindSelect: function ( e, ui ) {
    	var selected;
		app.Services.each(function(item) {
			if (item.attributes.name === ui.item.value) {
				// app.ProjectView.model.service = item;
				selected = item;
			}
		});
		this.model.attributes.service = selected;
		console.log("selected:"); 
		console.log(selected); 
		console.log('model'); 
		console.log(this.model); 
		return false;
	},
	
});

app.SignUpView = Backbone.View.extend({

    tagName: "section",

	className: 'row',
	
    initialize: function() {
    	Backbone.Validation.bind(this);
    	this.listenTo(this.model, 'change', this.render);
    	this.collectionFetched = false;

	},

	loadScripts: function() {
		var scripts = [
			{
				src: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBeDnT9G9IMIFxH9jjTUxmzSKwfForVk04&libraries=places&callback=app.signUpView.initAutocomplete',
				attrs: ['async', 'defer']
			}
		];
		scripts.forEach(function (s) {
		  var script = document.createElement('script');
		  script.src = s.src;
		  if (s.attrs) {
			  s.attrs.forEach(function (a) {
			    script[a] = true;
			  });
		  }
		  document.body.appendChild(script);
		});
	},

	autocomplete: null,

	initAutocomplete: function() {
		// Create the autocomplete object, restricting the search to geographical
		// location types.
		this.autocomplete = new google.maps.places.Autocomplete(
		      (document.getElementById('address')),
		      {types: ['geocode']});
		console.log('initautocomplete');
	    console.log('this.autocomplete');
	    console.log(this.autocomplete.getPlace());
		// When the user selects an address from the dropdown, populate the address
		// fields in the form.
		this.autocomplete.addListener('place_changed', this.fillInAddress);
	},

	componentForm: {
	  street_number: 'short_name',
	  route: 'long_name',
	  locality: 'long_name',
	  administrative_area_level_1: 'short_name',
	  country: 'long_name',
	  postal_code: 'short_name'
	},

	fullAddress:{},

	fillInAddress: function() {
		console.log('document.getElementById(address).value:');
	    console.log(document.getElementById('address').value);

	  // Get the place details from the autocomplete object.
	  var place = this.autocomplete.getPlace();
	  console.log('place: ');
	  console.log(this.place);
	  console.log('this.autocomplete.getPlace()');
	  console.log(this.autocomplete.getPlace());

	  // Get each component of the address from the place details
	  // and fill the corresponding field on the form.
	  for (var i = 0; i < place.address_components.length; i++) {
	    var addressType = place.address_components[i].types[0];
	    console.log('addressType: ');
	    console.log(addressType);

	    if (this.componentForm[addressType]) {
	      var val = place.address_components[i][this.componentForm[addressType]];
	      fullAddress[addressType] = val;
	      console.log('val:');
	      console.log(val);
	      console.log('document.getElementById(address).value:');
	      console.log(document.getElementById('address').value);
	      // if (addressType === "postal_code") {
	      //   var zipInput = document.querySelector('gold-zip-input')
	      //   zipInput.value = val;
	      //   zipInput.oninput();
	      // }
	    }
	  }
	},

	// as supplied by the browser's 'navigator.geolocation' object.
	geolocate: function() {
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
	      this.autocomplete.setBounds(circle.getBounds());
	    });
	  }
	},

	template: Handlebars.compile($('#tpl_signUp').html()),

    render: function(eventName) {
        this.$el.html(this.template(this.model.toJSON()));

        return this.el;
    },

    events: {
        "click #submit": "submit",
        'focus #company': 'getAutocomplete',
        'autocompleteselect' :   'handleFindSelect'
    },

    submit: function(event) {
       // event.preventDefault(); // Prevent form submission and contact with server
       // event.stopPropagation();
    	console.log('submitting');
    	
    	if ($('#password').val() !==$('#passwordConfirm').val()) {
    		$('#passwordConfirm').attr('data-content', 'Kindly ensure passwords match.');
    		$('#passwordConfirm').trigger('focus');
    		return;
    	}

        this.model.set({
            name: $('#name').val(),
            email: $('#email').val(),
            password: $('#password').val(),
            // employer: this.selectedEmployer


        });

        if (this.model.isNew()) {
            var self = this;
            app.people.create(this.model, {
            	wait : true,    // waits for server to respond with 200 before adding newly created model to collection
                success: function() {
                    app.sortRouter.navigate("", {trigger: true});
                },
                error : function(err) {
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

    fetchCollection: function() {
        app.companies.fetch({reset: true});
    },

    getEmployerSuggestions: function() {
    	var companySuggestions = [];
    	if (app.companies.length === 0) {
    		this.fetchCollection();
    	}
    	app.companies.each(function(element) {
    		console.log(element.attributes.name);
    		 companySuggestions.push(element.attributes.name);
    	});

    	return serviceSuggestions;
    },

    getAutocomplete: function () {
    	var data = app.companies.toJSON();
    	console.log(data);


        $("#employer").autocomplete({
          source: this.getEmployerSuggestions()
        });
    },

    handleFindSelect: function ( e, ui ) {
    	var selectedEmployer;
		app.companies.each(function(item) {
			if (item.attributes.name === ui.item.value) {
				// app.ProjectView.model.service = item;
				selectedEmployer = item;
			}
		});
		this.model.set({
			employer: selected
		});
		return false;
	},

	passwordValidation: function() {

	}
	
});

app.SignInView = Backbone.View.extend({

    tagName: "section",

	className: 'row',
	
    initialize: function() {
    	// Backbone.Validation.bind(this);
    	this.listenTo(this.model, 'change', this.render);

	},

	template: Handlebars.compile($('#tpl_signIn').html()),

    render: function(eventName) {
        this.$el.html(this.template(this.model.toJSON()));

        return this.el;
    },

    events: {
        "click .loginButton": "submit",
    },

    submit: function(event) {
       // event.preventDefault(); // Prevent form submission and contact with server
       // event.stopPropagation();
    	console.log('submitting');
    	app.people.fetch({reset: true});
    	console.log('app.people.toJSON()');
    	console.log(app.people.toJSON());
    	var formValues = {
            email: $('#email').val(),
            password: $('#password').val()
        };
    	this.model = app.people.findWhere(formValues);
    	app.loggedInUser = this.model;

    	console.log('this.model: ');
    	console.log(this.model);
        if (this.model === null || typeof this.model ===	'undefined') {
        	console.log('user email and password does not exist');
        	return;
        }

		var urlPath = "projects/new";

		if (!Backbone.history.navigate(urlPath, true)) {
		      console.log('wow');
		      Backbone.history.loadUrl();

		 } else {
		 	app.sortRouter.navigate(urlPath, {trigger: true});

		 }

    }	
});

Backbone.View.prototype.close = function() {
	console.log('Closing view '+ this);

	if (this.beforeClose) {
		his.beforeClose();
	}

	this.remove();
	this.unbind();
};


// ROUTES ////////////////////////////////////////////////////////
app.Router = Backbone.Router.extend({

	initialize: function() {
	    $('.navBar').html(new app.navView().render());
	},

    routes: {
        "": "home", //Home view
        "signUp": "signUp", //SignUp view
        "signIn": "signIn", //signIn view
        "projects/new": "newProject",
        "projects/:id": "projectDetails",
        "diligence": "showDueDiligence", //Due dilgence view
        "diligence/:id": "showProjectDueDiligence", //Due dilgence view
    },

    home: function() {
	    // console.log('Home');
	    // this.projectList();
	    $('.main').html(new app.homeView().render());
    },

    signUp: function() {
	    // console.log('Home');
	    // this.projectList();
	    app.signUpView = new app.SignUpView({
	    	model: new app.Person()
	    });
	    $('.main').html(app.signUpView.render());
	    app.SignUpView.prototype.loadScripts();
    	this.$signUpFieldset = $("fieldset#signUp .form-control");
    	
    	// Prevent automatic form submission.
    	document.getElementById("signUpForm").addEventListener("submit", function(event) {
    	  event.target.checkValidity();
    	  event.preventDefault(); // Prevent form submission and contact with server
    	  event.stopPropagation();
    	}, false);

    	$.fn.isValid = function(){
		    var validate = true;
		    this.each(function(){
		        if(this.checkValidity()===false){
		            validate = false;
		            console.log('this: ');
		            console.log(this);
		        }
		    });
		    return validate;
		};

		$.fn.validateThis = function(fieldset){
		  this.on("keyup", function() {
		    if (!this.checkValidity()) {
		      $(this).attr('data-content', this.validationMessage);
		      $(this).popover('show');
		      $(this).trigger('focus');
		    } else{
		      $(this).popover("hide");

		    }
		  });
		  this.on("focusout", function() {
		    if (!this.checkValidity()) {
		      $(this).attr('data-content', this.validationMessage);
		      // $(this).popover('show');
		      $(this).trigger('focus');
		      // nameProgress = 0;
		      // updateProgress();
		    }
		  });
		};


		$.fn.isFieldsetValid = function(fieldset){
		  this.each(function(){
		    $(this).validateThis(fieldset);
		  });
		};
		this.$signUpFieldset.isFieldsetValid(this.$signUpFieldset);
    },

    signIn: function() {
	    app.signInView = new app.SignInView({
	    	model: new app.Person()
	    });
	    $('.main').html(app.signInView.render());

    	// Prevent automatic form submission.
    	document.getElementById("signInForm").addEventListener("submit", function(event) {
    	  event.target.checkValidity();
    	  event.preventDefault(); // Prevent form submission and contact with server
    	  event.stopPropagation();
    	}, false);

    },
    projectList: function() {
    	if (app.loggedInUser === null || typeof app.loggedInUser ===	'undefined') {
        	console.log('current user is not logged in');
        	return;
        }

    	app.projectList = new app.ProjectsListView({
    	    model: app.projects
    	}).render();
    	$('.sideBar').html(app.projectList);


	    // Suppresses 'add' events with {reset: true} and prevents the app view
	    // from being re-rendered for every model. Only renders when the 'reset'
	    // event is triggered at the end of the fetch.
	    app.projects.fetch({reset: true});
    },

    projectDetails: function(id) {
    	if (app.loggedInUser === null || typeof app.loggedInUser ===	'undefined') {
        	console.log('current user is not logged in');
        	return;
        }
    	console.log('projectDetails');
    	console.log(id);

    	// Suppresses 'add' events with {reset: true} and prevents the app view
    	// from being re-rendered for every model. Only renders when the 'reset'
    	// event is triggered at the end of the fetch.
    	app.projects.fetch({reset: true});

        var project = app.projects.get(id);
        console.log('project: ');
        console.log(project);
        this.showView('.content', new app.ProjectView({
            model: project
        }));
    },

    newProject: function() {
    	if (app.loggedInUser === null || typeof app.loggedInUser ===	'undefined') {
        	console.log('current user is not logged in');
        	return;
        }

    	$('.main').html(new app.shellView().render());
    	this.projectList();
        this.showView('.content', new app.ProjectView({
            model: new app.Project()
        }));
    },
    showView: function(selector, view) {

    	if (app.loggedInUser === null || typeof app.loggedInUser ===	'undefined') {
        	console.log('current user is not logged in');
        	return;
        }



        if (this.currentView) this.currentView.close();
       
        $(selector).html(view.render());
        this.currentView = view;

        return view;
    }

});

app.sortRouter = new app.Router();
Backbone.history.start({pushState: true});
// Backbone.history.start();


