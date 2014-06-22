DAB.Router = Backbone.Router.extend({

	// Define the routes.
	routes: {
		'': 'home',
		'/:type/:slug': 'section',
	},

	home: function () {
	},

	section: function ( type, slug ) {
		$('.view-section').off( 'in-view', DAB.inviewHandler );
		$('.view-section').off( 'out-view', DAB.outviewHandler );
		$('#content').animate(
			{
				"scrollTop": 0
			},
			10,
			function () {
				$('.section').on( 'in-view', DAB.inviewHandler );
				$('.section').on( 'ou-tview', DAB.outviewHandler );
			}
		);

	}

});