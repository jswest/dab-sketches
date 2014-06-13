var fs  = require('fs')
,   csv = require('csv');

var fips = require('./../data/counties.json');
var dpic = require('./../data/dpic.json');

for (var i = 0; i < dpic.length; i++) {
  var id = dpic[i].state + " " + dpic[i].county;
  dpic[i].fips = fips[id] || null;
}

fs.writeFile(
  'data/merged-dpic-pretty.json',
  JSON.stringify(dpic, null, 2),
  function (error) {
    if (error) {
      console.log(error);
    }
    else {
      console.log('pretty file written.');
    }
  }
);