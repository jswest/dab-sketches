var fs  = require('fs')
,   csv = require('csv');

var fips = fs.readFileSync('data/fips-codes.csv').toString();

var counties = [];
var countiesFips = {};
csv()
.from.string(fips)
.to.array( function (data) {
  headers = data[0];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var goodRow = {};
    if (row[6] === "County" || row[6] === "Borough" || row[6] === "Parish") {
      for (var j = 0; j < headers.length; j++) {
        goodRow[headers[j]] = row[j];
      }
      counties.push(goodRow);
    }
  }
  for (var i = 0; i < counties.length; i++) {
    var county = counties[i];
    var state = counties[i]["State Abbreviation"].toLowerCase();
    var stateFips = counties[i]["State FIPS Code"];
    var county = counties[i]["GU Name"].toLowerCase();
    var countyFips = counties[i]["County FIPS Code"];
    var finalCode = stateFips + countyFips;
    countiesFips[state + " " + county ] = finalCode;

  }
  fs.writeFile(
    'data/counties.json',
    JSON.stringify(countiesFips, null, 2),
    function (error) {
      if (error) {
        console.log(error);
      }
      else {
        console.log('pretty file written.');
      }
    }
  );
});






