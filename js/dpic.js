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
  var keynames = {
    "race": [
      "white",
      "black",
      "latino",
      "native american",
      "asian",
      "other"
    ],
    "method": [
      "lethal injection",
      "electrocution",
      "gas chamber",
      "firing squad",
      "hanging",
      "other"
    ],
    "region": [
      "s",
      "w",
      "m",
      "n"
    ]
  };

  var sort = function (data, sortKey) {
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
      //,   maxx = d3.max( data, function ( d ) { return year(d.date); } )
      ,   maxx = new Date('2015')
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
        'rgb(255,149,207)',
        'rgb(255,0,174)',
        'rgb(255,207,149)',
        'rgb(255,174,0)',
        'rgb(149,207,255)',
        'rgb(0,174,255)'
      ];
      var color = d3.scale.ordinal()
        .domain([5,4,3,2,1,0])
        .range(colors)
      oneYearsWidth = x( new Date('2014-01-01')) - x( new Date('2013-01-01'));

      var createKey = function (sortKey) {
        if (el.find('table.key').length === 0) {
          el.append('<table class="key"></table>');
        }
        var keyel = el.find('table.key')
        keyel.html('');
        for (var i = 0; i < keynames[sortKey].length; i++) {
          keyel.append(
            '<tr>' +
              '<td style="background-color:' + color(i) + ';" class="colorblock"></td>' +
              '<td>' + keynames[sortKey][i] + '</td>' +
            '</tr>'
          );
        }
      };

      var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom')
        .ticks(10)
      svg.append('g').attr('class', 'x-axis')
      svg.select('g.x-axis')
        .call(xAxis)
        .attr('transform', 'translate(0,' + (sizes.height + 44) + ')')
        .selectAll('text')
        .attr('transform', 'translate(' + (oneYearsWidth / 2) + ',0)');

      var rect = svg.selectAll('rect')
        .data(sort(data, sortKey))
        .enter()
        .append('rect');

      var create = function (sortKey) {
        createKey(sortKey);
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
          .style( 'fill', function (d, i) { return color(colorIndex[d[sortKey]]); } )
        el.find('rect')
          .on('mouseover', function (e) {
            var d = d3.select(this).datum();
            var name    = d.name
            ,   method  = d.method
            ,   race    = d.race
            ,   sex     = d.sex 
            ,   state   = d.state;
            if (el.find('.inspector').length === 0) {
              el.append(
                '<table class="inspector">' +
                  '<tr>' +
                    '<th>name</th>' +
                    '<td class="inspector-name">' + name + '</td>' + 
                  '</tr>' +
                  '<tr>' +
                    '<th>method</th>' +
                    '<td class="inspector-method">' + method + '</td>' + 
                  '</tr>' +
                  '<tr>' +
                    '<th>race</th>' +
                    '<td class="inspector-race">' + race + '</td>' + 
                  '</tr>' +
                  '<tr>' +
                    '<th>sex</th>' +
                    '<td class="inspector-sex">' + sex + '</td>' + 
                  '</tr>' +
                  '<tr>' +
                    '<th>state</th>' +
                    '<td class="inspector-state">' + state + '</td>' + 
                  '</tr>' +
                '</table>'
              );
            } else {
              var inspector = el.find('.inspector');
            }
            var inspector = el.find('.inspector');
            inspector.css({
              'top': e.clientY - el.offset().top - 200,
              'left': e.clientX - el.offset().left - (inspector.width() / 2)
            });
          })
          .on('mouseout', function (e) {
            el.find('.inspector').remove();
          })
      };

      var update = function (sortKey) {
        createKey(sortKey);
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