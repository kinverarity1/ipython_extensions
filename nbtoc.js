// adapted from https://gist.github.com/magican/5574556

function clone_anchor(h) {
  // clone link
  var a = $(h).find('a').clone();
  a.attr('href', '#' + a.attr('id'));
  a.attr('id', '');
  return a;
}

function ol_depth(element) {
  // get depth of nested ol
  var d = 0;
  while (element.prop("tagName").toLowerCase() == 'ol') {
    d += 1;
    element = element.parent();
  }
  return d;
}

function table_of_contents(threshold) {
  if (threshold === undefined) {
    threshold = 4;
  }
  var cells = IPython.notebook.get_cells();
  
  var ol = $("<ol/>").addClass("nested");
  $("#toc").empty().append(ol);
  
  for (var i=0; i < cells.length; i++) {
    var cell = cells[i];
    
    if (cell.cell_type !== 'heading') continue;
    
    var level = cell.level;
    if (level > threshold) continue;
    
    var depth = ol_depth(ol);

    // walk down levels
    for (; depth < level; depth++) {
      var new_ol = $("<ol/>").addClass("nested");
      ol.append(new_ol);
      ol = new_ol;
    }
    // walk up levels
    for (; depth > level; depth--) {
      ol = ol.parent();
    }
    //
    ol.append(
      $("<li/>").addClass("nested").append(clone_anchor(cell.element))
    );
  }

  $('#toc-wrapper .header').click(function(){
    $('#toc').slideToggle();
    $('#toc-wrapper').toggleClass('closed');
    if ($('#toc-wrapper').hasClass('closed')){
      $('#toc-wrapper .hide-btn').text('[show]');
    } else {
      $('#toc-wrapper .hide-btn').text('[hide]');
    }
    return false;
  })

  $(window).resize(function(){
    $('#toc').css({maxHeight: $(window).height() - 200})
  })

  $(window).trigger('resize')
}

table_of_contents();


