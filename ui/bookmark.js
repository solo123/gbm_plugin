/***********************************************************************
*  Google Chrome Bookmarks Extension
*-------------------------------------------------------------------------------------
*  Create by: Jimmy Liang, 2009.12.24, Xmas eve just for fun
*  OpenSource: http://github.com/solo123/gbm_plugin.git
*
************************************************************************/
var bkg = chrome.extension.getBackgroundPage();  // ref to background.html
var status_count = 0;  // for the status text

var loading_template = "<table>" + 
      "<tr><td><img src='images/indicator.gif' /></td><td>Loading google bookmark...</td></tr>" +
      "</table>" +
      "<p>Not login? <a href='http://www.google.com/bookmarks' target='bookmark'>login now.</a></p>";

function InitAndShowHtml()
{
  // init
	$("#labels").html(loading_template);
	$("#current_label").text("");
	$("#bookmark_list").html("");
	if (bkg.load_ready)
    ShowBookmarksHtml();
	else
		bkg.LoadBookmarkFromUrl(AfterBookmarkLoaded);
}
function reload_bookmarks(){
	$("#refresh_icon").html("<img src='images/indicator.gif' />");
	bkg.LoadBookmarkFromUrl(AfterBookmarkLoaded);
}
function AfterBookmarkLoaded(){
	ShowBookmarksHtml();
	status_text("Bookmarks loaded.");
	$("#refresh_icon").html("<span class='ui-icon ui-icon-arrowrefresh-1-e'></span>");
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
		$("#div_bookmarks").height($("#div_main").height() - $("#labels").height() - 12);
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
	$("#bookmark_list").html(bkg.bookmarks_html);
	status_text("Selected label: " + bkg.current_label );
	var options = { to: "#div_bookmarks", className: 'ui-effects-transfer' }; 
	$(lnk).effect("transfer",options,500);
}

function tab_click(tab){
	if (tab==1){ // all
		filter();
	}
	else if (tab==3){ // add
	  // generate edit url by current tab's web page info.
	  chrome.tabs.getSelected(null, function(tab){
			var edit_url = bkg.google_bookmark_base + "mark?op=edit&output=popup"
				+ "&bkmk=" + encodeURI(tab.url) 
				+ "&title=" + encodeURI(tab.title);
			$("#frame_add").attr("src", edit_url);
		});
	}
}
function tab_show(tab){
	if (tab!=4)	$("#tabs").tabs('disable',4);
	if (tab!=3) $("#bm_add_lb").text("Add");
	if (tab==2) $('#accordion').accordion('resize');

}

function edit_bookmark(bmid, flag){
	var bm;
	if (flag==0)
		bm = (bkg.all_labels[bkg.current_label_id]).bookmarks[bmid];
	else
		bm = bkg.all_bookmarks[bmid];
	console.log("Edit:" + bm.href);
	var edit_page = bkg.google_bookmark_base + "mark?op=edit&output=popup&bkmk=" + encodeURI(bm.href);
	$("#tabs").tabs('select', 3);
	$("#frame_add").attr("src", edit_page);
	$("#bm_add_lb").text("Edit");
	status_text("Edit bookmark");
}


function show_dele_bookmark(bmid, flag){
	var bm;
	if (flag==0)
		bm = (bkg.all_labels[bkg.current_label_id]).bookmarks[bmid];
	else
		bm = bkg.all_bookmarks[bmid];
	$("#tabs").tabs('enable', 4).tabs('select',4);
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
	var bmid = $("#dele_id").text();
	console.log("Delete:(" + bmid + ")");
 	$.post(bkg.google_bookmark_base + "mark", {dlq: bmid, sig:bkg.sig}, function(data){
	 		console.log("delete success:" + data);
	 		bkg.bookmarks_html = "";
			bkg.LoadBookmarkFromUrl(AfterBookmarkLoaded);
			status_text("Bookmark deleted: " + bmid);
	 	}, "text");	
	$("#tabs").tabs('select',0);
}
function cancel_dele(){
	$("#tabs").tabs('select',0);
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

// generate bookmarks html by given label node.
function RenderAllBookmarks(reg){
	var s = new Array;
	var cnt = 0;
	s.push("<table width='100%' cellspacing='0' cellpadding='0' border='0'>");
	for (var i=0; i<bkg.all_bookmarks.length; i++){
		var bm = bkg.all_bookmarks[i];
		if (reg==null || reg.test(bm.title) || reg.test(bm.href)){
			s.push("<tr><td nowrap='nowrap'>");
			s.push("<span class='icon ui-icon ui-icon-pencil ui-corner-all' title='Edit' onclick='edit_bookmark("+ i +",1)' />");
			s.push("<span class='icon ui-icon ui-icon-trash ui-corner-all'  title='Delete' onclick='show_dele_bookmark("+ i +",1)' />");
			s.push("</td><td ");
			s.push("class='nowrap1'");
			s.push(">");
			s.push("<a href='");
			s.push(bm.href);
			s.push("' target='bookmark' title='");
			s.push(bkg.BookmarkDetail(bm));
			s.push("' >");
			s.push(bm.title);
			s.push("</a></td>");
			s.push("<td width='100'><span class='nowrap2'>");
			s.push(bm.labels);
			s.push("</span></td>");
			s.push("</tr>");
			s.push("<tr><td></td><td colspan='2'");
			s.push("<div class='bm_link'>");
			s.push(bm.href);
			s.push("</div>");
			s.push("</td></tr>");
			cnt++;
		}
	}
	s.push("</table>");
	$("#bm_count").text("(found:"+ cnt +")");
	$("#bm_all").html(s.join(""));
}

function filter(){
	var reg = new RegExp($("#bm_search").val(), "i");
	RenderAllBookmarks(reg);
}
$(function(){
	$("#tabs").tabs({
		select: function(event,ui){
			tab_click(ui.index);
		},
		show: function(event,ui){
			tab_show(ui.index);
		}
	}).tabs('disable',4);
	
	$("#accordion").accordion({
		fillSpace: true
	});
	
	InitAndShowHtml();
});
