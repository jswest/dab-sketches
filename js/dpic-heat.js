DAB.ModernExecutionsMapInteractive = function (el) {

  var that = this;

  var colors = [
    'rgb(70,62,64)',
    'rgb(68,70,79)',
    'rgb(58,86,106)',
    'rgb(37,117,159)',
    'rgb(0,174,255)',
  ];
  var colorScale = d3.scale.ordinal()
    .domain([0,1,2,3,4])
    .range(colors)


  var getRange = function (input) {
    if ( !input || input === "false" || input === 0) {
      return colorScale(0);

    } else if (input <= 1) {
      return colorScale(1);

    } else if (input <= 10) {
      return colorScale(2);

    } else if (input <= 50) {
      return colorScale(3);

    } else {
      return colorScale(4);
    }
  };

  var createKey = function () {
    el.append(
      '<table class="key">' +
        '<tr>' +
          '<td class="colorblock"></td>' +
          '<td>0 executions</td>' +
        '</tr>' +
        '<tr>' +
          '<td class="colorblock"></td>' +
          '<td>1 execution</td>' +
        '</tr>' +
        '<tr>' +
          '<td class="colorblock"></td>' +
          '<td>2 to 10 executions</td>' +
        '</tr>' +
        '<tr>' +
          '<td class="colorblock"></td>' +
          '<td>11 to 49 executions</td>' +
        '</tr>' +
        '<tr>' +
          '<td class="colorblock"></td>' +
          '<td>50 or more executions</td>' +
        '</tr>' +
      '</table>'
    );
    var table = el.find('table.key');
    for (var i = 0; i < table.find('td.colorblock').length; i++) {
      table.find('td.colorblock').eq(i).css('background-color', colorScale(i));
    }
  };

  this.build = function () {

    createKey();

    el.append('<h3 class="interlude-kicker">Interlude</h3>');
    el.append('<h1 class="interlude-title">The Narrow Practice of Capital Punishment</h1>');
    el.append('<h2 class="interlude-subtitle">Executions 1977 to Present</h2>');

    d3.json("data/us.repaired.topo.json", function (error, topology) {
      if (error) {
        console.log(error);
        return;
      }
      var scale = d3.scale.ordinal()
        .domain([0, 10, 100, 1000])
        .range([ 'rgb(0,0,0)', 'rgb(50,50,50)', 'rgb(100,100,100)', 'rgb(255,255,255)' ]);
      var projection = d3.geo.albersUsa()
        .scale(1600)
        .translate([el.width() / 2, el.height() / 2]);
      var path = d3.geo.path()
        .projection(projection);
      var svg = d3.select(el[0]).append('svg')
        .attr('width', el.width())
        .attr('height', el.height());
      svg.append('g').attr('class', 'counties')
        .selectAll("path.county")
        .data(topojson.feature(topology, topology.objects.counties).features)
        .enter()
        .append("path")
        .attr('id', function (d) {
          return "fips-" + d.id;
        })
        .attr("d", path)
        .attr('class', function (d) {
          if (d.properties.count !== "false" && d.properties.count > 0) {
            return 'executioner';
          }
        })
        .classed("county", true)
        .style('fill', function (d) {
          return getRange(d.properties.count);
        });
      svg.append('g').attr('class', 'states')
        .selectAll('path.state')
        .data(topojson.feature(topology, topology.objects.states).features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('id', function (d) {
          return 'fips-' + d.id;
        })
        .classed('state', true);
      $('.executioner')
        .css('cursor', 'pointer')
        .on('mouseover', function (e) {
          var d = d3.select(this).datum();
          if (d.properties.count !== "false" && d.properties.count > 0) {
            var name  = d.properties.name
            ,   count = d.properties.count
            ,   state = d.properties.state;
            if (el.find('.inspector').length === 0) {
              el.append(
                '<ul class="inspector">' +
                    '<li>' + name + ' county</li>' +
                    '<li>' + count + ' executions</li>' +
                '</ul>'
              );
            } else {
              var inspector = el.find('.inspector');
            }
            var inspector = el.find('.inspector');
            inspector.css({
              'top': e.clientY - el.offset().top - 100,
              'left': e.clientX - el.offset().left - (inspector.width() / 2)
            })
          }
        })
        .on('mouseout', function (e) {
          el.find('.inspector').remove();
        })
    });
  };

};