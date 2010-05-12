var PREFIX = "";

$(function() {
  $('#container').tabs();
  load_options();
  
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

  
});

// Saves options to localStorage.
function save_options() {
  $(".options").each(function(){
    var op = this.id;
    localStorage[PREFIX+op] = $(this).val();
  });

  var s = [];
   $('#sortable1 > li').each(function(idx, d){
    s.push($(d).text());    
   });
   localStorage["tabs"] = s.join(", "); 
  
  alert("Options Saved.");
}

function load_options() {
  if (!localStorage[PREFIX+"font_size"])
    restore_options();
  else {
    $(".options").each(function(){
      var op = this.id;
      var v  = localStorage[PREFIX + op];
      $(this).val(v ? v : "");
    });
  }
}
function load_option(option){
  var op = localStorage[option];
  if (op && op.length>0) 
    return op;
  else 
    return "";
}
// Restores select box state to saved value from localStorage.
function restore_options() {
  $("#theme").val("blue");
  $("#font_size").val("0.9em");
  $("#popup_width").val("610");
  $("#popup_height").val("620");
  $("#bookmark_url").val("http://www.google.com/bookmarks/");
  $("#sig_url").val("http://www.google.com/bookmarks/find");
}
