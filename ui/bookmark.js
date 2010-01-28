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
      .tabs("select", GetState("current_tab"))
      .bind('tabsselect', function(event,ui){bkg.States.previous_tab = bkg.States.current_tab;bkg.States.current_tab = ui.index; });
      //.bind('tabsselect', function(event,ui){TabClicked(event, ui);});
  }
}
function ReloadBookmarks(){
	$("#refresh_icon").html("<img src='images/indicator.gif' />"); //.unbind('click');
	bkg.LoadBookmarkFromUrl(AfterBookmarkLoaded);
}
function AfterBookmarkLoaded(){
	if (!bkg.MyBookmarks.load_ready || bkg.MyBookmarks.load_error) 
    status_text("Load bookmarks error, need login?");
  else {
    var current_tab = $("#tabs").tabs('option', 'selected');
    $("#tabs").unbind('tabsselect')
      .bind('tabsselect', function(event,ui){bkg.States.previous_tab = bkg.States.current_tab;bkg.States.current_tab = ui.index; });
    AfterTabShow(current_tab);
	  status_text("Bookmarks loaded.");
	}
	$("#refresh_icon").html("<span class='ui-icon ui-icon-arrowrefresh-1-e'></span>").click(ReloadBookmarks);
  $("#tabs").data('disabled.tabs', '');
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
  
	if (tab!=3) $("#label_add").text("Add");
	if (tab==0){
	  bm_load();
  } else if (tab==1){
    sh_load();
  } else if (tab==2){
    lb_load();
  } else if (tab==3){
    if ($("#label_add").text()=="Add"){
  	  // get add url from chrome's tab
  	  chrome.tabs.getSelected(null, function(ctab){
  	    var l = GetStateInt("current_label_id");
  	    var bm = {
  	       id   : '',
  	       href : ctab.url,
           title : ctab.title,
           labels : l>0 ? bkg.MyBookmarks.all_labels[l].label : '',
           timestamp : new Date()  
        };
        ShowBmTable(bm,"Add");
  		});
    }
  }
}
function save_add_bookmark(){
  $.ajax({
		type: "post",
		url: bkg.GOOGLE_BOOKMARK_BASE + "mark",
		data: {
      bkmk : $('#bm_url').val(), 
      prev : '', 
      title : $('#bm_title').val(), 
      labels : $('#bm_labels').val(), 
      sig : bkg.MyBookmarks.sig},
		success: function(data, textStatus){
		  status_text("Bookmark Saved:" + data.toString().substr(0,40));
		  $("#tabs").tabs('select',bkg.States.previous_tab);
		  bkg.LoadBookmarkFromUrl(AfterBookmarkLoaded);
		},
		error: function(){
		  status_text('Bookmark save error!');
		}
	});
}
function ShowBmTable(bm, operation){
  $("#label_add").text(operation);
  if (operation=="Add"){
    bm1 = bkg.GetBookmarkByUrl(bm.href);
    if (bm1){
      bm.labels = bm1.labels;
      bm.timestamp = bm1.timestamp;
      ShowBmTable(bm,"Edit");
      return;
    }
    $("#bm_op_title").text("Add Bookmark").css('color','green');
    $("#btn_op").val("Add Bookmark").unbind('click').click(save_add_bookmark);
  } else if (operation=="Edit"){
    $("#bm_op_title").text("Edit Bookmark").css('color','darkblue');
    $("#btn_op").val("Save").unbind('click').click(save_add_bookmark);
  } else if (operation=="Delete"){
    $("#bm_op_title").text("Delete Bookmark").css('color','red');
    $("#btn_op").val("Confirm Delete").unbind('click').click(dele_bookmark);
  }
  $("#bm_url").val(bm.href);
  $("#bm_title").val(bm.title);
  $("#bm_id").text(bm.bm_id);
  $("#bm_labels").val(bm.labels.join(""));
  $("#bm_time").text(bm.timestamp.getFullYear() +"."
			+ bm.timestamp.getMonth() + "."
			+ bm.timestamp.getDay() + " " + bm.timestamp.toTimeString() );
}
function OpenEditTab(bookmark){
	ShowBmTable(bookmark,"Edit");
	$("#tabs").tabs('select', 3);
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

//------------------- startup ------------------------------
$(function(){
  $("#tabs").tabs({show: function(event,ui){AfterTabShow(ui.index)}});
  $("#accordion").accordion({fillSpace: true});
  $("#label_add").text("Add");
  
	Init();
});
