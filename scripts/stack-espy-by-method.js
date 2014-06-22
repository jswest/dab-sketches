var fs   = require('fs');
var espy = require('./../data/raw/espy-full-sorted.json');

// get an array of executions methods
var methods = [];
for (var i = 0; i < espy.length; i++) {
	var execution = espy[i];
	if (methods.indexOf(execution.method) === -1) {
		methods.push(execution.method);
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

var niceMethods = [
	'lethal injection',
	'electrocution',
	'gas chamber',
	'firing squad',
	'hanging',
	'other'
]
// get the data by year
// right now, just build the structure of the object.
/*
{
	"1776": {
		"hanging": 0, // every one of these is zero for now.
		"firing squad": 0,
		etc.
	},
	etc.
}
*/
var dataByYear = {};
for (var i = 1776; i <= 2002; i++) {
	var year = i.toString();
	var yearsData = {};
	for (var j = 0; j < niceMethods.length; j++) {
		var method = niceMethods[j];
		yearsData[method] = 0;
	}
	dataByYear[year] = yearsData;
}

// now fill in the data
for (var i = 0; i < espy.length; i++) {
	var execution = espy[i];
	if (execution.year >= 1776) {
		var method = methodIndex[execution.method];
		dataByYear[execution.year][method]++;	
	}
	
}

// now turn the data into an array rather than on object.
var sortedData = [];
for (var i = 1776; i <= 2002; i++) {
	var year = i.toString();
	dataByYear[year].year = year;
	sortedData.push(dataByYear[year]);
}

var stackedData = [];
// interate over the methods, which will become the "layers" of the stack
// then, for each of them, iterate over the years worth of data
// push the year's entry into a new array, which will have the structure:
// [
//    [ // array representing a group
//      { "x": year, "y": value },
//      etc.
//    ],
//    [ // array representing a group
//      { "x": year, "y": value },
//      etc.
//    ],
//    etc.
// ]
for (var i = 0; i < niceMethods.length; i++) {
	var method = niceMethods[i];
  var methodArray = [];
  for (var j = 0; j < sortedData.length; j++) {
  	var executionsThisYear = sortedData[j];
    var entry = { "x": executionsThisYear.year, "y": executionsThisYear[method] };
    entry.method = method;
    methodArray.push(entry);		
	
  }
  stackedData.push(methodArray);
}

fs.writeFile(
	'data/espy-method.json',
	JSON.stringify(stackedData),
	function (error) { error ? error : "file written." }
);




