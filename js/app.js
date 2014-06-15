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
    });
    d3.selectAll('.collapsed-name-pane').on('mouseover', function (d, i) {
      if ($('footer.stream-footer').hasClass('hidden')) {
        $('footer.stream-footer').removeClass('hidden');
      }
      d3.select('td.name-date').text(d.date);
      d3.select('td.name-method').text(d.method);
      d3.select('td.name-race').text(d.race);
      d3.select('td.name-age').text(d.age);
      d3.select('td.name-sex').text(d.sex);
      d3.select('td.name-state').text(d.state);
      d3.select('td.name-victims').text(d["number / race / sex of victims"]);
    });
    d3.selectAll('.collapsed-name-pane').on('mouseout', function (d, i) {
      if (!$('footer.stream-footer').hasClass('hidden')) {
        $('footer.stream-footer').addClass('hidden');
      }
    });
  
    $('.year-marker').eq(5).before('<article class="pane interactive interlude" id="interlude-2"></article>');
    $('.year-marker').eq(10).before('<article class="pane interactive interlude" id="interlude-1"></article>');
    $('.year-marker').eq(15).before('<article class="pane interactive interlude" id="interlude-0"></article>');


    d3.json('data/panes.json', function (data) {
      panes.each(function (i) {
        var d = d3.select(this).datum();
        d3.select(this).attr('data-name', d.name.split(' ').join('-'));
      });
      for (var j = 0; j < data.length; j++ ) {
        var thisNode = $('[data-name="' + data[j].name.split(' ').join('-') + '"');
        thisNode.addClass('clickable-name');
        d3.select(thisNode[0]).datum().essay = data[j].essay;
      }

      var minimap = $('.minimap ol');
      var currentYear = 0;
      var names = [];
      for (var j = 0; j < data.length; j++) {
        names.push(data[j].name);
      }
      panes.each(function (d, i) {
        var year = new Date(d.date).getFullYear();
        if (year > currentYear) {
          currentYear = year;
          minimap.append('<li class="minimap-year">' + year + '</li>');
        }
        if (names.indexOf(d.name) > -1) {
          minimap.append('<li class="minimap-name">' + d.name + '</li>');
        }
      });
      $('li.minimap-year').eq(5).before(
        '<li class="minimap-interlude">' + 
          'Last Words in Texas' +
        '</li>'
      );
      $('li.minimap-year').eq(10).before(
        '<li class="minimap-interlude">' + 
          'The Narrow Practice of Capital Punishment' +
        '</li>'
      );
      $('li.minimap-year').eq(15).before(
        '<li class="minimap-interlude">' + 
          'The State of Modern Capital Punishment' +
        '</li>'
      );
      
      $('.minimap').addClass('faux-hover');
      var minimapTimer = setTimeout(function () {
        $('.minimap').removeClass('faux-hover');
      }, 2000 );



      var nameClickHandler = function (e) {
        if (e.target.className !== "x") {
          $(this).off('click')
          $(this).removeClass('collapsed-name-pane')
          $(this).addClass('expanded-name-pane');
          var streamScrollTop = $('.stream').scrollTop();
          $('.stream').animate({
            "scrollTop": streamScrollTop + $(this).offset().top - 44
          }, 500);
          var d = d3.select(this).datum();
          d3.select(this).append('div').attr('class', 'essay-content').html(d.essay)
          d3.select(this).append('button').attr('class', 'x');
          d3.select(this).select('div.essay-content').classed('show', true);
          var thisel = $(this);
          $(this).find('button.x').on('click', function (e) {
            thisel.find('button.x').remove();
            thisel.find('div.essay-content').remove();
            thisel.removeClass('expanded-name-pane');
            thisel.addClass('collapsed-name-pane');
            thisel.on('click', nameClickHandler);
          });          
        }
      };

    
      $('.clickable-name').on('click', nameClickHandler);
    });
  });

};
