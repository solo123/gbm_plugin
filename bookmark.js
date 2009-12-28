/***********************************************************************
*  Google Chrome Bookmarks Extension
*-------------------------------------------------------------------------------------
*  Create by: Jimmy Liang, 2009.12.24, Xmas eve just for fun
*  OpenSource: http://github.com/solo123/gbm_plugin.git
*
************************************************************************/
var bkg = chrome.extension.getBackgroundPage();  // ref to background.html
var bookmark_edit_url = "";  // the edit url for the current tab's web page.
var status_count = 0;  // for the status text

var loading_template = "<table>" + 
      "<tr><td><img src='indicator.gif' /></td><td>Loading google bookmark...</td></tr>" +
      "</table>" +
      "<p>Not login? <a href='http://www.google.com/bookmarks' target='bookmark'>login now.</a></p>";

function InitAndShowHtml()
{
  // init
	$("#labels").html(loading_template);
	$("#current_label").text("");
	$("#bookmark_list").html("");
  // generate edit url by current tab's web page info.
  chrome.tabs.getSelected(null, function(tab){
		bookmark_edit_url = bkg.google_bookmark_base + "mark?op=edit&output=popup"
			+ "&bkmk=" + encodeURI(tab.url) 
			+ "&title=" + encodeURI(tab.title);
	});

	if (bkg.load_ready)
    ShowBookmarksHtml();
	else
		bkg.LoadBookmarkFromUrl(AfterBookmarkLoaded);
}
function AfterBookmarkLoaded(){
	ShowBookmarksHtml();
	status_text("Bookmarks loaded.");
}
function ShowBookmarksHtml(){
	if (!bkg.load_ready || bkg.last_error!=""){
		$("#labels").html("<h2>Load google bookmark error:" + bkg.last_error + "</h2><p>Not login? <a href='http://www.google.com/bookmarks' target='bookmark'>login now.</a></p>");
		status_text("Load bookmarks error.");
  }
  else {
    // load success and show the html
		if(bkg.bookmarks_html=="") bkg.SetCurrentLabel(bkg.current_label_id);
		$("#labels").html(bkg.labels_html);
		$("#div_bookmarks").height($("#div_main").height() - $("#labels").height() - 32);
		$("#current_label").text("[" + bkg.current_label + "]");
		$("#bookmark_list").html(bkg.bookmarks_html);
		$("#btn_bookmarks").addClass("current_tab");
	} 
}

function labelClick(lnk){
	bkg.SetCurrentLabel(lnk.id);
	$("#div_bookmarks").height($("#div_main").height() - $("#labels").height() - 12);
	$("#labels .selected").removeClass("selected").addClass("f");
	lnk.className = "selected";
	bkg.labels_html = $("#labels").html();
	$("#current_label").text("[" + bkg.current_label + "]");
	$("#bookmark_list").html(bkg.bookmarks_html);
	status_text("Selected label: " + bkg.current_label );
}

function tab_click(tab){
	status_text("");
	$("#buttons, a.current_tab").removeClass("current_tab");
	var new_page = bookmark_edit_url;
	if (bkg.current_label!="null" && bkg.current_label!="ALL")
		new_page = new_page + "&labels=" + encodeURI(bkg.current_label);
	if ($(tab).text()=="Bookmarks" ){
		hide_divs();
		$("#div_main").show();
		$(tab).addClass("current_tab");
		$("#btn_add_text").text("Add");
	} 
	else if ($(tab).text().trim()=="Add"){
		hide_divs();
		$("#div_add").show();
		$("#frame_add").height(490).width(560).attr("src", new_page);
		$(tab).addClass("current_tab");
	}
	else if ($(tab).text()=="Reload"){
		hide_divs();
		$("#div_main").show();
		$("#btn_bookmarks").addClass("current_tab");
		bkg.LoadBookmarkFromUrl(AfterBookmarkLoaded);
	}
}

function edit_bookmark(bmid){
	var bkmk = $(bmid).parent().parent().find('a').attr('href');
	console.log("Edit:" + bkmk);
	
	$("#buttons, a.current_tab").removeClass("current_tab");
	var edit_page = bkg.google_bookmark_base + "mark?op=edit&output=popup&bkmk=" + encodeURI(bkmk);
	$("#div_main").hide();
	$("#div_add").show();
	$("#frame_add").attr("src", edit_page).height(490).width(560);
	$("#btn_add").addClass("current_tab")
	$("#btn_add_text").text("Edit");
	status_text("Edit bookmark");
}
function show_dele_bookmark(bmid){
	$("#buttons, a.current_tab").removeClass("current_tab");
	$("#div_main").hide();
	$("#div_add").hide();
	$("#div_delete").show();
	$("#btn_add").addClass("current_tab");
	$("#btn_add_text").text("Delete");
	
	var bm = (bkg.all_labels[bkg.current_label_id]).bookmarks[bmid];
  $("#dele_url").text(bm.href);
  $("#dele_title").text(bm.title);
  $("#dele_id").text(bm.bm_id);
  $("#dele_bmid").text(bmid);
  $("#dele_label").text(bm.labels);
  $("#dele_time").text(bm.timestamp.getFullYear() +"."
			+ bm.timestamp.getMonth() + "."
			+ bm.timestamp.getDay() + " " + bm.timestamp.toTimeString() );
}
function dele_bookmark(bmid){
	var bmid = $("#dele_bmid").text();
	var bm = (bkg.all_labels[bkg.current_label_id]).bookmarks[bmid];
	console.log("Delete:(" + bm.bm_id + ") " + bm.href);
 	$.post(bkg.google_bookmark_base + "mark", {dlq: bm.bm_id, sig:bkg.sig}, function(data){
	 		console.log("delete success:" + data);
	 		bkg.bookmarks_html = "";
			bkg.LoadBookmarkFromUrl(AfterBookmarkLoaded);
			status_text("Bookmark deleted: " + bmid);
	 	}, "text");	
	hide_divs();
	$("#btn_add_text").text("Add");
	$("#div_main").show();
	$("#buttons, a.current_tab").removeClass("current_tab");
	$("#btn_bookmarks").addClass("current_tab");
}
function hide_divs(){
	$("#div_main").hide();
	$("#div_add").hide();
	$("#div_delete").hide();
}
function cancel_dele(){
	hide_divs();
	$("#div_main").show();
	$("#buttons, a.current_tab").removeClass("current_tab");
	$("#btn_bookmarks").addClass("current_tab");
	$("#btn_add_text").text("Add");
	status_text("");
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
$(function(){
	hide_divs();
	$("#div_main").show();
	InitAndShowHtml();
});
