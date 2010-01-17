/***********************************************************************
*  Google Chrome Bookmarks Extension
*-------------------------------------------------------------------------------------
*  Create by: Jimmy Liang, 2009.12.24, Xmas eve just for fun
*  OpenSource: http://github.com/solo123/gbm_plugin.git
*
************************************************************************/
var bkg = chrome.extension.getBackgroundPage();  // ref to background.html
var status_count = 0;  // for the status text

// ------------------- init & reload -------------------------
function Init()
{
  if (!bkg.MyBookmarks.load_ready) 
    ReloadBookmarks();
  else {
  	$("#refresh_icon").html("<span class='ui-icon ui-icon-arrowrefresh-1-e'></span>").click(ReloadBookmarks);
    $("#tabs")
      .data('disabled.tabs', [4])
      .tabs("select", GetState("current_tab"));
      //.bind('tabsselect', function(event,ui){TabClicked(event, ui);});
  }
}
function ReloadBookmarks(){
	$("#refresh_icon").html("<img src='images/indicator.gif' />").unbind('click');
	bkg.LoadBookmarkFromUrl(AfterBookmarkLoaded);
}
function AfterBookmarkLoaded(){
	if (!bkg.MyBookmarks.load_ready || bkg.MyBookmarks.load_error) 
    status_text("Load bookmarks error:" + bkg.MyBookmarks.error_message);
  else {
    var current_tab = $("#tabs").tabs('option', 'selected');
    AfterTabShow(current_tab);
	  status_text("Bookmarks loaded.");
	}
	$("#refresh_icon").html("<span class='ui-icon ui-icon-arrowrefresh-1-e'></span>").click(ReloadBookmarks);
  $("#tabs").data('disabled.tabs', [4]);
}
function GetStateInt(state){
  if (typeof(bkg.States[state])=="undefined")
    return -1;
  else
    return bkg.States[state];
}
function GetState(state){
  if (typeof(bkg.States[state])=="undefined")
    return "";
  else
    return bkg.States[state];
}

//----------------- Tab events ---------------------------------------
function LoadReady(){
  return (bkg && bkg.MyBookmarks.load_ready);
}
function AfterTabShow(tab){
  if (!LoadReady()) return;
	if (tab!=4)	$("#tabs").tabs('disable',4);
	if (tab!=3) $("#label_add").text("Add");
	if (tab==0){
	  if (bm_isempty()) bm_load();
  } else if (tab==1){
    if (sh_isempty()) sh_load();
  } else if (tab==2){
    if (lb_isempty()) lb_load();
  } else if (tab==3){
    if ($("#label_add").text()=="Add"){
      $("#frame_add").attr("src", "");
  	  // get add url from chrome's tab
  	  chrome.tabs.getSelected(null, function(ctab){
  			var add_url = bkg.GOOGLE_BOOKMARK_BASE 
          + "mark?op=edit&output=popup"
  				+ "&bkmk=" + encodeURI(ctab.url) 
  				+ "&title=" + encodeURI(ctab.title)
          + "&labels=" + encodeURI(bkg.MyBookmarks.all_labels[GetStateInt("current_label_id")].label);
  			$("#frame_add").attr("src", add_url);
  		});
    }
  } 
}
function OpenEditTab(bookmark){
	//console.log("Edit:" + bookmark.href);
	var edit_page = bkg.GOOGLE_BOOKMARK_BASE + "mark?op=edit&output=popup&bkmk=" + encodeURI(bookmark.href);
	$("#frame_add").attr("src", edit_page);
	$("#label_add").text("Edit");
	$("#tabs").tabs('select', 3);
	// status_text("Edit bookmark");
}
function status_text(statusText){
	if ( statusText==null){
		if (status_count==3)
			$("#status_bar").css("color","black");
	  else if (status_count==2)
	  	$("#status_bar").css("color","gray");
	  else if (status_count==1)
	  	$("#status_bar").css("color","#aaa");
	  status_count -= 1;
	  if (status_count>0)
	  	setTimeout("status_text();", 2000);
	  else
	  	$("#status_bar").text(">");
	}
	else {
		$("#status_bar").text("> " + statusText).css("color","red");
    if (statusText!=""){
      status_count = 4;
      setTimeout("status_text()",2000);
    }
	}
}

function BookmarkTips(bookmark){
		var tips = bookmark.title + 
			'\n----------------------------------------------------------------\n' +
			'Url:       ' + bookmark.href   + "\n" + 
			'Labels:  ' + bookmark.labels + "\n" +
			'Create: ' + bookmark.timestamp.getFullYear() +"."
			+ bookmark.timestamp.getMonth() + "."
			+ bookmark.timestamp.getDay() + " " 
      + bookmark.timestamp.toTimeString() + "\n";
   return tips;
}
function SaveCurrentState(){
  bkg.States.current_tab = $("#tabs").tabs('option', 'selected');
}
//------------------- startup ------------------------------
$(function(){
  $("#tabs").tabs({
    show: function(event,ui){AfterTabShow(ui.index)},
    disabled: [1,2,3,4]
  });

  $("#accordion").accordion({
		fillSpace: true
	});

	Init();
});
