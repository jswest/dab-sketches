var fs  = require('fs')
,   csv = require('csv');

var dpic = require('./../data/dpic.json');

var codes = fs.readFileSync('data/fips-codes.csv').toString();
var states = [];
var counties = [];
csv()
  .from.string(codes)
  .to.array(function (codesArray) {
    headerRow = codesArray[0];
    for (var i = 1; i < codesArray.length; i++) {
      var row = codesArray[i];
      if (row[6] === "County" || row[6] === "Borough" || row[6] === "Parish") {
        counties.push({ "id": (parseInt(row[1]) +  "") + row[2], "name": row[5].toLowerCase(), "state": row[0].toLowerCase() });
      }
      var stateObject = { "id": parseInt(row[1]), "name": row[0].toLowerCase() };
      var doit = true;
      for (var j = 0; j < states.length; j++) {
        if (states[j].id === stateObject.id) {
          doit = false;
          break;
        }
      }
      if (doit) {
        states.push(stateObject);
      }
    }
    // iterate over the dpic database and create the counts of the states and counties
    stateCounts = {};
    countyCounts = {};
    for (var i = 0; i < dpic.length; i++) {
      var state = dpic[i].state;
      var county = dpic[i].county;
      for (var j = 0; j < states.length; j++) {
        if (state === states[j].name) {
          stateCounts[state] = stateCounts[state] || 0;
          stateCounts[state]++;
        }
      }
      for (var j = 0; j < counties.length; j++) {
        if (county === counties[j].name && state === counties[j].state ) {
          countyCounts[counties[j].id] = countyCounts[counties[j].id] || 0;
          countyCounts[counties[j].id]++;
        }
      }
    }
    // iterate over the states and create csv file of them with counts
    var csvString = "id,name,count\n";
    for (var i = 0; i < states.length; i++) {
      var row = "" + states[i].id + "," + states[i].name + "," + (stateCounts[states[i].name] || "false") + "\n";
      csvString += row;
    }
    fs.writeFile(
      'data/state-counts.csv',
      csvString,
      function (error) {
        console.log((error ? error : 'state counts file written.'));
      }
    );
    var csvString = "id,name,count\n";
    for (var i = 0; i < counties.length; i++) {
      var row = "" + counties[i].id + "," + counties[i].name + "," + (countyCounts["" + counties[i].id] || "false") + "\n";
      csvString += row;
    }
    fs.writeFile(
      'data/county-counts.csv',
      csvString,
      function (error) {
        console.log((error ? error : 'county counts file written.'));
      }
    );
  });