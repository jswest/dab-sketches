DAB.Generator = function () {

  var stream    = d3.select('div#stream')
  ,   minimap   = d3.select('ol#minimap-list')
  ,   $stream   = $('div#stream')
  ,   $minimap  = $('ol#minimap-list');

  d3.json('data/dpic.json', function (dpic) {
  d3.json('data/names.json', function (names) {
  d3.json('data/interludes.json', function (interludes) {

    currentYear = 0;
    currentName = 0;
    for (var i = 0; i < dpic.length; i++) {
      var execution = dpic[i];
      var year = new Date(execution.date).getFullYear();

      var yearWrapper;
      if (currentYear < year) {
        minimap.append('li').attr('class', 'year').text(year);
        yearWrapper = stream.append('div')
          .classed('year', true)
          .classed('view-section', true)
          .attr('id', 'year-' + year)
          .attr('data-slug', year);
        yearWrapper.append('div').attr('class', 'year-marker').append('h1').text(year);
        currentYear = year;
      }

      var nameEl;
      if (names[currentName].name === execution.name) {
        minimap.append('li').classed('name', true).text(execution.name);
        nameEl = yearWrapper.append('article').attr('class', 'name essay');
        nameEl.datum(names[currentName]);
        nameEl.append('h1').text(execution.name);
        nameEl.append('div').attr('class', 'essay-wrapper');
        nameEl.append('button').attr('class', 'x');
        nameEl.on('click', function (d) {
          if (!$(this).hasClass('active') && !$(d3.event.target).hasClass('x')) {
            $(this).addClass('active');
            var d = d3.select(d3.event.target).datum();
            $('#stream-wrapper').animate({'scrollTop': $('#stream-wrapper').scrollTop() + $(this).offset().top -  44}, 500);
            $(this).addClass('expanded');
            d3.select(this).select('.essay-wrapper').html(d.essay);            
          }
          $(this).find('.x').on('click', function (e) {
            var parent = $(this).parent();
            parent.removeClass('active');
            parent.removeClass('expanded');
            parent.children('.essay-wrapper').html('');
          });
        });
        currentName++;
      } else {
        nameEl.datum(execution);
        nameEl = yearWrapper.append('section').attr('class', 'name');
        nameEl.append('h1').text(execution.name);
      }

    }

    for (var i = 0; i < interludes.length; i++) {
      var interlude   = interludes[i];
      $minimap.find('li.year').eq(interlude.position).before('<li class="interlude">' + interlude.name + '</li>');
      $stream.find('.year')
        .eq(interlude.position)
        .before('<article class="interlude view-section"></article>');
      if (i === 0) {
        $('.interlude').addClass('out');
      }
      $('article.interlude').eq(i).data('slug', interlude.slug);
      for (var j = 0; j < interlude.panes.length; j++) {
        var pane = interlude.panes[j];
        if (pane.type !== "interactive") {
          $('article.interlude').eq(i).append(
            '<div class="pane ' + pane.type + '">' +
              pane.content +
            '</div>'
          );
        } else {
          $('article.interlude').eq(i).append(
            '<div class="pane ' + pane.type + '" id="' + pane.id + '"></div>'
          );
          var interactive = new DAB[pane.builder]($('#' + pane.id));
          interactive.build();
        }
      }
    }

    $('.pane').height($(window).height() - 44);
    var outTimer = setTimeout(function () {
      $('.interlude').removeClass('out');
    }, 100);
    $stream.trigger('panes-set');

  });
  });
  });
};