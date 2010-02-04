/***********************************************************************
*  Google Chrome Bookmarks Extension
*-------------------------------------------------------------------------------------
*  Create by: Jimmy Liang, 2009.12.24, Xmas eve just for fun
*  OpenSource: http://github.com/solo123/gbm_plugin.git
*
************************************************************************/
var bkg,bookmarks,config,div_container,div_top,div_main,div_footer;
var tabsobj, current_tabobj;

function load_option(option){
  var op = localStorage[option];
  if (op && op.length>0) 
    return op;
  else 
    return default_option(option);
}
function default_option(option){
  if (option=="width") return "500";
  else if (option=="height") return "400";
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
    tabs     : (tabs ? tabs : ["Bookmarks", "Search", "Labels","Add","Tools"])
  };
  
  tabsobj = [new BookmarkTabObject(), new BookmarkSearchObject(), new LabelsObject()];
  div_container = $('#container');
}

function ShowObject(){
  this.title = "";
  this.key   = "";
}

function reload_bookmarks(){
  render_loading(div_main);
  bookmarks.LoadBookmarkFromUrl(load_tabs);
}
function load_tabs(){
  if (bookmarks.load_error){
    div_container.html("");
    render_error(div_container);
    return;
  }
  
  div_top = $('<div>');
  div_main = $('<div class="main">');
  div_footer = $('<div class="footer">');
  div_container.html("").append(div_top).append(div_main).append(div_footer);
  div_top.width(config.width);
  render_tabs(div_top, config.tabs);
  render_status();
  
  resize_divs();
}
function resize_divs(){
  var h = config.height - div_top.height() - div_footer.height(); 
  div_main.height(h);
  div_main.width(config.width);
  div_footer.width(config.width);
  if (current_tabobj) current_tabobj.resize();
  status_text("set main:" + h + ", config:" + config.height + ",top:"+div_top.height() +",footer:"+div_footer.height());
}

$(function(){
  init_config();
  if (typeof(on_testing) != "undefined") return;
  //load_tabs();
  //return;
  
  if (!bookmarks.load_ready){
    render_loading(div_container);
    bookmarks.LoadBookmarkFromUrl(load_tabs);
  } else {
    load_tabs();
  }
  
});
