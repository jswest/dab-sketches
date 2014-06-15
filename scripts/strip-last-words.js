var fs      = require('fs')
,   tdcj    = require('./../data/tdcj-pretty.json')
,   ignore  = require('./../data/google-stop-words.json');


var wordcounts = {};
var goodwords = [];
for (var i = 0; i < tdcj.length; i++) {
  var statement = tdcj[i].lastWords;
  if (statement) {
   var words = statement.split(' ');
    for (var j = 0; j < words.length; j++) {
      var word = words[j];
      if (
        word.indexOf('(') === -1 &&
        word.indexOf(')') === -1 &&
        word.indexOf('<') === -1 &&
        word.indexOf('>') === -1 &&
        word.indexOf('[') === -1 &&
        word.indexOf(']') === -1
      ) {
        word = word.replace(/&rsquo;/g, "");
        word = word.replace(/&lsquo;/g, "");
        word = word.replace(/&hellip;/g, "");
        word = word.replace(/&quot;/g, "");
        word = word.toLowerCase().replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()?']/g,"");
        wordcounts[word] = wordcounts[word] || 0;
        wordcounts[word]++;
        if (goodwords.indexOf(word) === -1) {
          goodwords.push(word);
        }
      }
    }   
  } 
}

var goodcounts = [];
for (var i = 0; i < goodwords.length; i++) {
  var word = goodwords[i];
  if (ignore.indexOf(word) === -1 && word.length > 2) {
    var count = wordcounts[word];
    goodcounts.push({ word: word, count: count });
  }
}
var goodcounts = goodcounts.sort(function (a,b) {
  return a.count < b.count ? 1 : -1;
})

var lastWords = [];
for (var i = 0; i < goodcounts.length; i++) {
  var word = goodcounts[i].word;
  var count = goodcounts[i].count;
  if (count > 5) {
    for (var j = 0; j < count; j++) {
      lastWords.push(word);
    }
  }
}
var lastWords = lastWords.join(' ');
fs.writeFile('data/last-words.txt', lastWords, function (error) {
  return error ? error : "file written.";
});
fs.writeFile('data/last-words.json', JSON.stringify(goodcounts, 2, null), function (error) {
  return error ? error : "file written.";
})