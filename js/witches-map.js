var WitchesMap = function () {

	var that = this; // a little of this; a little of that.

	var width = $('.witches-panel').width();
	var height = $('.witches-panel').height();
	var svg = d3.select( '.witches-panel' ).append( 'svg' )
		.attr( 'width', width )
		.attr( 'height', height );

	var getDataByYear = function ( inputData ) {
		
		var outputData = [];
		
		var dataByYear = [];
		for ( var i = 0; i < inputData.length; i++ ) {
			var datum = inputData[i];
			var datumYear = datum.year;
			if ( datumYear === "null" ) {
				datumYear = datum["year-meyerink"];
			}
			if ( dataByYear.indexOf( datumYear ) === -1 ) {
				dataByYear.push( datumYear );
			}
		}

		//for ( var i = 1647; i <= 1692; i++ ) {
		for ( var i = 0; i < dataByYear.length; i++ ) {
			
			var numericalYear = parseInt( dataByYear[i] );
			var year = dataByYear[i];
			var yearsExecutions = { "year": year, "data": [], "executions": [] };
			var yearsRawData = [];
			
			// interate over the data to find the current years' executions
			for ( var j = 0; j < inputData.length; j++ ) {

				var datum = inputData[j];

				var datumYear = datum.year;
				if ( datumYear === "null" ) {
					datumYear = datum["year-meyerink"];
				}

				if ( parseInt( datumYear ) <= numericalYear ) {
					yearsRawData.push( datum );
				}

				if ( year === datumYear ) {
					yearsExecutions.executions.push({
						"name": datum.name,
						"method": datum.method
					});
				}
			}

			// interate over the yearsRawData
			var dataByLocation = {};
			for ( var j = 0; j < yearsRawData.length; j++ ) {
				if ( !dataByLocation[yearsRawData[j].location] ) {
					dataByLocation[yearsRawData[j].location] = {
						"name": yearsRawData[j].location,
						"longitude": yearsRawData[j].latlong.split( ',' )[1],
						"latitude": yearsRawData[j].latlong.split( ',' )[0],
						"executions": []
					};
					dataByLocation[yearsRawData[j].location].executions.push( yearsRawData[j] );
				} else {
					dataByLocation[yearsRawData[j].location].executions.push( yearsRawData[j] );
				}
			}
			var locations = _.keys( dataByLocation );
			for ( var j = 0; j < locations.length; j++ ) {
				var location = locations[j];
				var locationDatum = dataByLocation[location];
				yearsExecutions.data.push({
					"name": locationDatum.name,
					"executions": locationDatum.executions,
					"longitude": locationDatum.longitude,
					"latitude": locationDatum.latitude,
					"radius": (locationDatum.executions.length * 1.25) + 7
				});
			}
			outputData.push( yearsExecutions );
		}

		return outputData;
	};

	var displayWitches = function ( projection, data ) {
		$('.year').html( data.year );
		$('.executions').html( '' );
		for ( var i = 0; i < data.executions.length; i++ ) {
			console.log( $('.executions').length );
			$('.executions').append( '<li>' + data.executions[i].name + '</li>' );
		}
		$('#bubbles').remove();
		svg.append( 'g' ).attr( 'id', 'bubbles' );
		that.bubbles = d3.select( '#bubbles' ).selectAll( 'circle' )
			.data( data.data )
			.enter()
			.append( 'circle' )
  		.attr( 'transform', function ( d ) {
  			var projectedPosition = projection( [ d.longitude, d.latitude ] );
  			return "translate(" + projectedPosition[0] + "," + projectedPosition[1] + ")";
  		})
  		.attr( 'r', function ( d ) {
  			return d.radius;
  		})
	}


	this.on = function () {
		d3.json( "/data/us.topo.json", function( error, us ) {
		  if ( error ) {
		  	return console.error( error );
		  }
			var projection = d3.geo.mercator()
		  	.scale( 10000 )
		  	.center( [ -72.6743, 41.7627 ] )
		  	.rotate( [ 0, 0 ] )
		  	.translate( [ width / 2, height / 2 ] )
			var path = d3.geo.path()
		    .projection( projection );

		  var g = svg.append( 'g' ).attr( 'class', 'wrapper' );


		  var states = g.append( 'g' ).attr( 'id', 'states' )
		  	.selectAll( 'path' )
		  	.data( topojson.feature( us, us.objects["us.geo"] ).features )
		  	.enter()
		  	.append( 'path' )
		  	.attr( 'class', 'state' )
		  	.attr( 'id', function ( d ) {
		  		return d.id;
		  	})
		  	.attr( 'd', path );

			d3.csv( "/data/witches.csv", function ( witches ) {
				var data = getDataByYear( witches );

				var displayWitch = function ( i ) {
					displayWitches( projection, data[i] );
					that.timer = setTimeout( function () {
						if ( i < data.length ) {
							displayWitch( i + 1 );							
						}
					}, 1500 );		
				};
				displayWitch( 0 );
			});
		});
	}


};
