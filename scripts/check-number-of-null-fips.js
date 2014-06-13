var dpic = require('./../data/merged-dpic-pretty.json');
var count = 0;
var no = 0;
for (var i = 0; i < dpic.length; i++) {
  if (!dpic[i].fips) {
    no++;
  }
  count++;
}
console.log(no);
console.log(no / count * 100);