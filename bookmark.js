var bkg = chrome.extension.getBackgroundPage();
var retry = 0;

function LoadData()
{
	$("#labels").html("<table><tr><td><img src='indicator.gif' /></td><td>Loading google bookmark...</td></tr></table><p>Not login? <a href='http://www.google.com/bookmarks' target='bookmark'>login now.</a></p>");
	$("#current_label").text("");
	$("#bookmark_list").html("");

  chrome.tabs.getSelected(null, function(tab){
		current_url = tab.url;
		current_title = tab.title;
		$("#add_bookmark").attr("href",bkg.google_bookmark_add + "&bkmk=" + encodeURI(current_url) + "&title=" + encodeURI(current_title)  );
	});

	if (bkg.load_ready){
		$("#labels").html(bkg.labels_html);
		$("#div_bookmarks").height($("#main").height() - $("#labels").height() - 12);
		$("#current_label").text(bkg.current_label);
		$("#bookmark_list").html(bkg.bookmarks_html);
		return;
	}
	
	//if (bkg.last_error!="") alert(bkg.last_error);
  if (retry>10)
		RefreshBookmark();
	else
    setTimeout("LoadData();", 1000); 
	retry = retry + 1;
}
function RefreshBookmark(){
	retry = 0;
	bkg.load_ready = false;
	bkg.LoadBookmark();
	LoadData();
}

function labelClick(lnk){
	$("#div_bookmarks").height($("#main").height() - $("#labels").height() - 12);

	bkg.SetCurrentLabel(lnk.id);
	$("#labels .selected").removeClass("selected").addClass("f");
	lnk.className = "selected";
	bkg.labels_html = $("#labels").html();
	$("#current_label").text(bkg.current_label);
	$("#bookmark_list").html(bkg.bookmarks_html);
}

$(function(){
	LoadData();
});
