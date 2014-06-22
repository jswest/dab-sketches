DAB.HistoricalExecutionsInteractive = function (el) {


  el.append('<h1 class="graph-title">Executions 1776 to 2002</h1>');

	var colorIndex = {
		'lethal injection': 0,
		'electrocution': 1,
		'gas chamber': 2,
		'firing squad': 3,
		'hanging': 4,
		'other': 5
	}
	var keynames = {
		"method": [
			'lethal injection',
			'electrocution',
			'gas chamber',
			'firing squad',
			'hanging',
			'other'
		]
	}

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

	this.build = function () {

		createKey('method');

    var sizes = {
      elWidth: el.width(),
      elHeight: $(window).height() - 44,
      width: el.width() - 88, // this shouldn't be hardcoded. we should have a sizes global
      height: $(window).height() - 132,
      top: 44,
      left: 44
    };

    var svg = d3.select(el[0]).append('svg')
      .attr('width', sizes.elWidth)
      .attr('height', sizes.elHeight);

    d3.json('data/espy-method.json', function (data) {

    	var xScale = d3.time.scale()
    		.domain([new Date('1776'), new Date('2003')])
    		.range([sizes.left, sizes.width])
    	var yScale = d3.scale.linear()
    		.domain([200, 0])
    		.range([sizes.top, sizes.height])
    	var oneYearsWidth = xScale(new Date('1778')) - xScale(new Date('1777'));

      var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(10)
      svg.append('g').attr('class', 'x-axis')
      svg.select('g.x-axis')
        .call(xAxis)
        .attr('transform', 'translate(0,' + (sizes.height) + ')')
        .selectAll('text')
        .attr('transform', 'translate(' + (oneYearsWidth / 2) + ',0)');


    	var stack = d3.layout.stack();
     	var stackedData = stack(data);

    	var groups = svg.selectAll('g.layer')
    		.data(stackedData)
    		.enter()
    		.append('g').classed('layer', true)

    	var rects = groups.selectAll('rect')
    		.data(function (d) { return d; })
    		.enter()
    		.append('rect')
    		.attr('x', function (d) { return xScale(new Date(d.x)); })
    		.attr('y', function (d) { return yScale( d.y0 + d.y); }) // magic
    		.attr('height', function (d) { return yScale(d.y0) - yScale(d.y0 + d.y); }) // magic
    		.attr('width', oneYearsWidth)
    		.style('fill', function (d) { return color(colorIndex[d.method]); })
    });

	};

};