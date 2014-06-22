var fs   = require('fs');
var espy = require('./../data/raw/espy-full-sorted.json');

// get an array of executions methods
var races = [];
for (var i = 0; i < espy.length; i++) {
	var execution = espy[i];
	if (races.indexOf(execution.race) === -1) {
		races.push(execution.race);
	}
}

var methodIndex = {
	'Injection': 'lethal injection',
	'Electrocution': 'electrocution',
	'Asphyxiation-Gas': 'gas chamber',
	'Shot': 'firing squad',
	'Hanging': 'hanging',
	'Other': 'other',
	undefined: 'other',
	'Burned': 'other',
	'Pressing': 'other',
	'Gibbeted': 'other',
	'Bludgeoned': 'other',
	'Hung in Chains': 'other',
	'Break on Wheel': 'other',
};


console.log(races);