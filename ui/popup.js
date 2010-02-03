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
    tabs     : (tabs ? tabs : ["Bookmarks"])
  };
  div_container = $('#container');
}

function load_bookmarks(callback){
  if (!bookmarks.load_ready){
    render_loading(div_container);
    bookmarks.LoadBookmarkFromUrl(callback);
  } else {
    if (callback) callback();
  }
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
  
  render_tabs(div_top, config.tabs);
  var h = config.height-div_top.height()-div_footer.height(); 
  div_main.height(h).width(config.width);
  var lb = div_main.find('.bm-labels');
  if (lb){
  //status_text("lbs:"+lbs.height()+",div:"+div.height() );
    if (lb.height() > div_main.height()/2.5){
      lb.height(Math.round(div_main.height()/2.5));
      div_main.find('.bm-bookmarks').height(div_main.height()-lb.height()-24);
    }
  }
  render_status();
  //status_text("set main:" + h + ", config:" + config.height + ",top:"+div_top.height() +",footer:"+div_footer.height());
}

$(function(){
  init_config();
  if (typeof(on_testing) != "undefined") return;
  
  load_bookmarks(load_tabs);
});
