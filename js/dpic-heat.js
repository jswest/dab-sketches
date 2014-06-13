DAB.ModernExecutionsMapInteractive = function (el) {

  var that = this;

  var colors = [
    'rgb(70,62,64)',
    'rgb(68,70,79)',
    'rgb(58,86,106)',
    'rgb(37,117,159)',
    'rgb(0,174,255)'
  ];
  var colorScale = d3.scale.ordinal()
    .domain([0,1,2,3,4])
    .range(colors)


  var getRange = function (input) {
    if ( !input || input === "false" || input === 0) {
      console.log( colorScale(4) );
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
  }


  this.build = function () {


    el.append('<h1 class="graph-title">Modern Executions by County</h1>');

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
      svg.selectAll("path")
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
        .style('fill', function (d) {
          if ( d.state === 'ak' || d.name === 'ak' || d.state === 'hi' || d.name === 'hi' ) {
            return "none";
          }
          return getRange(d.properties.count);
        })
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
              inspector.find('td').eq(0).html(name);
              inspector.find('td').eq(1).html(count);
              inspector.find('td').eq(2).html(state);
            }
            var inspector = el.find('.inspector');
            inspector.css({
              'background-color': 'rgb(255,255,255)',
              'position': 'absolute',
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