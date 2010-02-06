BMOptions.prototype = new ShowObject;
BMOptions.prototype.constructor = BMOptions;
function BMOptions(){
  this.render = function(div){
    this.parentDiv = div;
  
    var s = ' \
<div id="resizer" class="ui-widget-content ui-state-highlight ui-resizable">\
<div>\
  <div class="resizer-body" >\
    <h3 class="ui-widget-header">Options</h3>\
    <p>\
      <span>Font size:</span>\
      <input class="options" type="text" id="font_size" size="7" />\
      <b>%</b> or <b>px</b> or <b>em</b>\
    </p>\
    <fieldset>\
    <legend>Popup Size</legend>\
    <p>\
      <span class="resizer-prompt">width:</span>\
      <input type="text" class="options" id="width" disabled size="5" />px (client: <span id="client-w"></span>px) \
    </p>\
    <p>\
      <span class="resizer-prompt">height:</span>\
      <input type="text" class="options" id="height" disabled size="5" />px (client: <span id="client-h"></span>px) \
    </p></fieldset> <div class="clear"></div> \
<div class="option_sort"> \
<ul id="sortable1" class="droptrue"> \
  <h2>SHOW TABS</h2> \
</ul> \
<ul id="sortable2" class="droptrue"> \
  <h2>HIDE TABS</h2> \
</ul> \
<br clear="both" /> \
</div> \
  </div>\
  <div class="resizer-tools">\
    <input type="button" value="Save Options" onclick="save_options();" /> \
    <input type="button" value="Restore to default" onclick="restore_options();" /> <span id="op_out"></span> \
  </div></div></div>';

    div.html(s);    
    
    load_options();
    $('body').css('overflow','auto');
    var r = $('#resizer');
    if (localStorage["height"]) r.height(localStorage["height"]);
    if (localStorage["width"]) r.width(localStorage["width"]);
    
     r.resizable({
        minWidth:  400,
        minHeight: 200,
        stop: function(a,b){
          localStorage["width"] = b.size.width;
          localStorage["height"] = b.size.height;
          $('#width').val(b.size.width);
          $('#height').val(b.size.height);
          $('#client-w').text(''+document.documentElement.clientWidth);
          $('#client-h').text(''+document.documentElement.clientHeight);
        }
     });
     
    
    var all_tabs = ["Bookmarks","Search","Labels","Add","Tools"];
    var tt = load_option("tabs");
    var show_tabs = all_tabs;
    if (tt && tt.length>0) show_tabs = tt.split(",");
    for (var i=0; i<all_tabs.length; i++) {
      if (tt && tt.length>0 && tt.indexOf(all_tabs[i])<0){
        $('#sortable2').append($('<li class="ui-state-highlight">').text(all_tabs[i]));
      }
    }
    for (var i=0; i<show_tabs.length; i++)
      $('#sortable1').append($('<li class="ui-state-default">').text(show_tabs[i]));
      
		$("ul.droptrue").sortable({
			connectWith: 'ul',
			items: 'li',
		});
		$("#sortable1, #sortable2").disableSelection();

  }
  this.resize = function(){};
  this.refresh = function(){};
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
  $('#op_out').text("Options loaded.");
}
function restore_options(){
  $('#font_size').val('0.9em');
  $('#height').val('400');
  $('#width').val('400');
  localStorage["width"] = 400;
  localStorage["height"] = 400;
  localStorage["font_size"] = "0.9em";
  localStorage["tabs"] = "";
  $('#op_out').text("Default options.");
}
function save_options() {
  $(".options").each(function(){
    var op = this.id;
    localStorage[op] = $(this).val();
  });
  
  var s = [];
   $('#sortable1 > li').each(function(idx, d){
    s.push($(d).text());    
   });
   localStorage["tabs"] = s.join(", "); 
  $('#op_out').text("Options saved.");
}
function load_options() {
  $(".options").each(function(){
    var op = this.id;
    var v  = localStorage[op];
    $(this).val(v ? v : "");
  });
}