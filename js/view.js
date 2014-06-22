DAB.inviewHandler = function ( e ) {
  
  var sectionType;
  if ($(this).hasClass('year')) {
    sectionType = 'year';
  }
  else if ($(this).hasClass('interlude')) {
    sectionType = 'interlude';
  }
  var slug = $(this).data('slug');

  DAB.router.navigate('#/' + sectionType + '/' + slug);
  if ($(this).hasClass('interlude')) {
    $('#stream-wrapper').addClass('active-interlude');
  }
};

DAB.outviewHandler = function ( e ) {
  $('#stream-wrapper').removeClass('active-interlude');
};