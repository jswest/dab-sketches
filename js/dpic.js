DAB.ModernExecutionsInteractive = function (el) {

  var that = this;

  var sortKey = 'race';

  var createControls = function () {
    el.append(
      '<ul class="controls">' +
        '<li class="control" data-sort-key="method">method</li>' +
        '<li class="control" data-sort-key="region">region</li>' +
        '<li class="control active" data-sort-key="race">race</li>' +
      '</ul>'
    );
    el.find('ul.controls').on('click', function (e) {
      $(this).toggleClass('clicked');
    });
  };

  var createTitle = function () {
    el.append('<h3 class="interlude-kicker">Interlude</h3>');
    el.append('<h1 class="interlude-title">Modern Executions</h1>');
  };

  var colorIndex = {
    "white": 0,
    "black": 1,
    "latino": 2,
    "native american": 3,
    "asian": 4,
    "other": 5,
    "lethal injection": 0,
    "electrocution": 1,
    "gas chamber": 2,
    "firing squad": 3,
    "hanging": 4,
    "other": 5,
    "s": 0,
    "w": 1,
    "m": 2,
    "n": 3
  };
  var nicenames = {
    "white": "white",
    "black": "black",
    "latino": "latino",
    "native american": "native american",
    "asian": "asian",
    "other": "other",
    "lethal injection": "lethal injection",
    "electrocution": "electrocution",
    "gas chamber": "gas chamber",
    "firing squad": "firing squad",
    "hanging": "hanging",
    "other": "other",
    "s": "south",
    "w": "west",
    "n": "northeast",
    "m": "midwest"
  };

  var sort = function (data, sortKey) {
    console.log( data[0][sortKey] );
    console.log(colorIndex[data[0][sortKey]]);
    return data.sort(function (a, b) {
      return colorIndex[a[sortKey]] > colorIndex[b[sortKey]] ? 1 : -1
    });
  };

  var year = function (date) {
    return new Date(date.split('/')[2] + '-01-01');
  };

  var sizes
  ,   svg
  ,   x
  ,   y
  ,   h
  ,   color
  ,   oneYearsWidth;
  this.build = function () {

    createControls();
    createTitle();

    var sizes = {
      elWidth: el.width(),
      elHeight: el.height(),
      width: el.width() - 88, // this shouldn't be hardcoded. we should have a sizes global
      height: el.height() - 88,
      top: 44,
      left: 44
    };

    var svg = d3.select(el[0]).append('svg')
      .attr('width', el.width())
      .attr('height', el.height());

    d3.json('data/dpic.json', function (data) {
      
      var minx = d3.min( data, function ( d ) { return year(d.date); } )
      ,   maxx = d3.max( data, function ( d ) { return year(d.date); } )
      ,   miny = 0
      ,   maxy = 120;

      x = d3.time.scale()
        .domain([minx, maxx])
        .range([sizes.left, sizes.left + sizes.width]);
      y = d3.scale.linear()
        .domain([maxy, miny])
        .range([sizes.top, sizes.top + sizes.height]);
      h = d3.scale.linear()
        .domain([miny, maxy])
        .range([0, sizes.height]);
      var colors = [
        'rgb(0,89,127)',
        'rgb(45,90,128)',
        'rgb(191,134,191)',
        'rgb(161,161,229)',
        'rgb(149,207,255)',
        'rgb(0,174,255)',
      ];
      var color = d3.scale.ordinal()
        .domain([5,4,3,2,1,0])
        .range(colors)
      oneYearsWidth = x( new Date('2014-01-01')) - x( new Date('2013-01-01'));

      var rect = svg.selectAll('rect')
        .data(sort(data, sortKey))
        .enter()
        .append('rect');

      var create = function (sortKey) {
        var indices = {};
        rect
          .attr('transform', function (d, i) {
            var xpos = x(year(d.date));
            var ypos = sizes.height + sizes.top;
            return 'translate(' + xpos + ',' + ypos + ')';
          })
          .transition()
          .delay(500)
          .duration(700)
          .attr('width', oneYearsWidth - 2)
          .attr('height', h(1) - 2)
          .attr('transform', function (d, i) {
            var date = year(d.date).toString(); 
            if ( indices[date] ) {
              indices[date]++;
            }
            else {
              indices[date] = 1;
            }
            var xpos = x(year(d.date));
            var ypos = y(indices[date]);
            return 'translate(' + xpos + ',' + ypos + ')';
          })
          .style( 'fill', function (d, i) { return color(colorIndex[d[sortKey]]); } );
      };

      var update = function (sortKey) {
        var indices = {};
        rect
          .transition()
          .duration(500)
          .attr('transform', function (d, i) {
            var xpos = x(year(d.date));
            var ypos = sizes.height + sizes.top;
            return 'translate(' + xpos + ',' + ypos + ')';
          })
        rect
          .data(sort(data, sortKey))
          .transition()
          .delay(500)
          .duration(100)
          .attr('transform', function (d, i) {
            var xpos = x(year(d.date));
            var ypos = sizes.height + sizes.top;
            return 'translate(' + xpos + ',' + ypos + ')';
          })
          .transition()
          .delay(600)
          .duration(500)
          .attr('transform', function (d, i) {
            var date = year(d.date).toString(); 
            if ( indices[date] ) {
              indices[date]++;
            }
            else {
              indices[date] = 1;
            }
            var xpos = x(year(d.date));
            var ypos = y(indices[date]);
            return 'translate(' + xpos + ',' + ypos + ')';
          })
          .style( 'fill', function (d, i) { return color(colorIndex[d[sortKey]]); } );
      };

      el.find('.control').on('click', function (e) {
        if (!$(this).hasClass('active')) {
          el.find('.control').removeClass('active');
          $(this).addClass('active');
          var newSortKey = $(this).data('sort-key');
          update(newSortKey);          
        }   
      });

      create(sortKey);
    });

  };


  


  this.destroy = function () {
    el.find('svg').remove();
  };

};