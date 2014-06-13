var DAB = {};

DAB.NameList = function () {

  d3.json('data/dpic.json', function (data) {
    var panes = d3.select('.stream')
      .selectAll('article.name-pane')
      .data(data)
      .enter()
      .append('article')
      .attr('class', 'pane name-pane collapsed-name-pane');
    panes
      .append('h1').attr('class', 'name')
      .text(function (d) {
        return d.name
      });
    var currentYear = 0;
    panes.each(function (d, i) {
      var year = new Date(d.date).getFullYear();
      if (year > currentYear) {
        currentYear = year;
        $(this).before('<div class="year-marker"><h1>' + year + '</h1></div>')
      }
    })
    d3.selectAll('.collapsed-name-pane').on('mouseover', function (d, i) {
      if ($('footer.stream-footer').hasClass('hidden')) {
        $('footer.stream-footer').removeClass('hidden');
        $('footer.stream-footer ul').css('display', 'block');
      }
      d3.select('.name-date').text(d.date);
      d3.select('.name-method').text(d.method);
      d3.select('.name-race').text(d.race);
      d3.select('.name-age').text(d.age);
      d3.select('.name-state').text(d.state);
      d3.select('.name-victims').text(d["number / race / sex of victims"]);
    });
    d3.selectAll('.collapsed-name-pane').on('mouseout', function (d, i) {
      if (!$('footer.stream-footer').hasClass('hidden')) {
        $('footer.stream-footer').addClass('hidden');
      }
    });
  
    $('.year-marker').eq(0).before('<article class="pane interactive interlude" id="interlude-1"></article>');
    $('.year-marker').eq(5).before('<article class="pane interactive interlude" id="interlude-0"></article>');


    d3.json('data/panes.json', function (data) {
      panes.each( function(i) {
        var d = d3.select(this).datum();
        d3.select(this).attr('data-name', d.name.split(' ').join('-'));
      });
      for (var j = 0; j < data.length; j++ ) {
        var thisNode = $('[data-name="' + data[j].name.split(' ').join('-') + '"');
        thisNode.addClass('clickable-name');
        d3.select(thisNode[0]).datum().essay = data[j].essay;
      }
      $('.clickable-name').on('click', function (e) {
        if (!$(this).hasClass('expanded-name-pane')) {
          $(this).removeClass('collapsed-name-pane')
          $(this).addClass('expanded-name-pane');
          var streamScrollTop = $('.stream').scrollTop();
          $('.stream').animate({
            "scrollTop": streamScrollTop + $(this).offset().top - 44
          }, 500);
          var d = d3.select(this).datum();
          console.log(d)
          d3.select(this).append('div').attr('class', 'essay-content').html(d.essay)
          d3.select(this).select('div.essay-content').classed('show', true);
        }
      });
    });
  });

};
