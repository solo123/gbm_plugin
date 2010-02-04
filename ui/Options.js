BMOptions.prototype = new ShowObject;
BMOptions.prototype.constructor = BMOptions;
function BMOptions(){
  this.render = function(div){
    this.parentDiv = div;
    div.html("");
    this.resizer = $('<div>');
    var bd = $('<div>').addClass('ui-widget-content');
    var tit= $('<h3>').addClass('ui-widget-header').text('Options');
    var fnt = $('<p>')
      .append( $('<span>').text('Font size:') )
      .append( $('<input type="text" id="font_size">').addClass('options').attr('size','7') )
      .append( $('<br>') )
      .append( $('<span>').html("* Please type <b>%</b> or <b>px</b> or <b>em</b> inside.") )
    var sze = $('<fieldset>')
      .append( $('<legend>').text('Popup size') );
    var wdt = $('<p>')
      .append($('<span>').text('width:'))
      .append($('<input type="text" id="width">').addClass('options').attr('size','5'))
      .text('px (400~1000px)');
    var hgt = $('<p>')
      .append($('<span>').text('height:'))
      .append($('<input type="text" id="height">').addClass('options').attr('size','5'))
      .text('px (300~800px)');
    sze.append(wdt).append(hgt);
    
    var btn = $('<div>')
      .append( $('<input type="button">').val('Save Options').click(save_options) )
      .append( $('<input type="button">').val('Restore Default').click(restore_options) )
      
    bd.append(tit).append(fnt).append(sze).append(btn);
  }
}
  
function set_options(){
  $('body').css('height','auto').css('width','auto');
  $('#container').hide();
  var r = $('#resizer');
  r.show();
  r.resizable({
      minWidth:  340,
      minHeight: 400,
      stop: function(a,b){
        localStorage["width"] = b.size.width;
        localStorage["height"] = b.size.height;
        $('#width').val(b.size.width);
        $('#height').val(b.size.height);
      }
   });
  if (localStorage["height"]) r.height(localStorage["height"]);
  if (localStorage["width"]) r.width(localStorage["width"]);
  load_options();
}
function restore_options(){
  $('#font_size').val('0.9em');
  $('#height').val('580');
  $('#width').val('600');
}
function save_options() {
  $(".options").each(function(){
    var op = this.id;
    localStorage[op] = $(this).val();
  });
}