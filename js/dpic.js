DAB.ModernExecutionsInteractive = function (el) {

  var that = this;

  var sortKey = 'region';

  var createControls = function () {
    el.append(
      '<ul class="controls">' +
        '<li>sorted by <span class="current-sort-key">' + sortKey + '</span></li>' +
        '<li class="control" data-sort-key="method">method</li>' +
        '<li class="control" data-sort-key="region">region</li>' +
        '<li class="control" data-sort-key="race">race</li>' +
      '</ul>'
    );
    el.find('ul.controls').on('click', function (e) {
      $(this).toggleClass('clicked');
    });
  };

  var createTitle = function () {
    el.append('<h3 class="interlude-kicker">Interlude</h3>');
    el.append('<h1 class="interlude-title">Modern Executions</h1>');
  }

  var sort = function (data, sortKey) {
    return data.sort(function (a, b) {
      if ( a[sortKey] > b[sortKey] ) {
        return 1;
      } else if (a[sortKey] < b[sortKey]) {
        return -1;
      } else {
        if (a.name < b.name) {
          return 1;
        } else {
          return -1;
        }
      }
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
      color = d3.scale.category20();
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
          .style( 'fill', function (d, i) { return color(d[sortKey]); } );
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
          .style( 'fill', function (d, i) { return color(d[sortKey]); } );
      };

      el.find('.control').on('click', function (e) {
        var newSortKey = $(this).data('sort-key');
        update(newSortKey);
        el.find('span.current-sort-key').html(newSortKey);
      });

      create(sortKey);
    });

  };


  


  this.destroy = function () {
    el.find('svg').remove();
  };

};