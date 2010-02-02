var PREFIX = "gbm_plugin.";

$(function() {
  $('#container').tabs();
  load_options();
});

// Saves options to localStorage.
function save_options() {
  $(".options").each(function(){
    var op = this.id;
    localStorage[PREFIX+op] = $(this).val();
  });
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

// Restores select box state to saved value from localStorage.
function restore_options() {
  $("#theme").val("blue");
  $("#font_size").val("0.9em");
  $("#popup_width").val("610");
  $("#popup_height").val("620");
  $("#bookmark_url").val("http://www.google.com/bookmarks/");
  $("#sig_url").val("http://www.google.com/bookmarks/find");
}
