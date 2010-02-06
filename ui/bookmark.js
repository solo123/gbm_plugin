/***********************************************************************
*  Google Chrome Bookmarks Extension
*-------------------------------------------------------------------------------------
*  Create by: Jimmy Liang, 2009.12.24, Xmas eve just for fun
*  OpenSource: http://github.com/solo123/gbm_plugin.git
*
************************************************************************/
var gbm_app;

// super-class for operation objects.
function ShowObject(){
  this.title = "";
  this.key   = "";
}

$(function(){
  if (typeof(on_testing) != "undefined") return;
  
  gbm_app = new BookmarkApp();
  gbm_app.start_up($('#container'));
});
