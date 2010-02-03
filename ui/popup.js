/***********************************************************************
*  Google Chrome Bookmarks Extension
*-------------------------------------------------------------------------------------
*  Create by: Jimmy Liang, 2009.12.24, Xmas eve just for fun
*  OpenSource: http://github.com/solo123/gbm_plugin.git
*
************************************************************************/
var bkg,bookmarks,config,div_container,div_top,div_main,div_footer;

function load_option(option){
  var op = localStorage[option];
  if (op && op.length>0) 
    return op;
  else 
    return default_option(option);
}
function default_option(option){
  if (option=="width") return "600";
  else if (option=="height") return "500";
  else if (option=="font_size") return "0.9em";
}

function init_config(){
  bkg = chrome.extension.getBackgroundPage();  // ref to background.html
  bookmarks = bkg.bookmarks;
  var tabs = load_option("tabs");
  config = {
    width    : parseInt(load_option("width")),
    height   : parseInt(load_option("height")),
    font_size: load_option("font_size"),
    tabs     : (tabs ? tabs : ["bookmarks"])
  };
  div_container = $('#container');
  div_top = $('#top');
  div_main = $('#main');
  div_footer = $('#footer');
}

function load_bookmarks(){
  if (!bookmarks.load_ready){
    render_loading(div_main);
    bookmarks.LoadBookmarkFromUrl(load_tabs);
  } else {
    load_tabs();
  }
}
function load_tabs(){
  div_main.html("");
  render_tabs(div_top, config.tabs);
}

$(function(){
  init_config();
  if (typeof(on_testing) != "undefined") return;
  
  load_bookmarks();
  
});
