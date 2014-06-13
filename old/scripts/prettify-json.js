var fs = require( 'fs' )
,		usa = require( '../data/states.topo.json' );

fs.writeFile(
	'states-pretty.topo.json',
	JSON.stringify( usa, null, 2 ),
	function ( error ) {
		console.log( 'file written.' );
	}
)