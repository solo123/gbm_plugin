var bkg = chrome.extension.getBackgroundPage();

function LoadBookmark()
{
	$("#labels").html("<table><tr><td><img src='indicator.gif' height='24' /></td><td>Loading google bookmark...</td></tr></table><p>Not login? <a href='http://www.google.com/bookmarks' target='bookmark'>login now.</a></p>");
	$("#current_label").text("");
	$("#bookmark_list").html("");
    chrome.tabs.getSelected(null, function(tab){
		current_url = tab.url;
		current_title = tab.title;
		$("#add_bookmark").attr("href",bkg.google_bookmark_add + "&bkmk=" + encodeURI(current_url) + "&title=" + encodeURI(current_title)  );
	});

	if (!bkg.load_ready){ setTimeout("LoadBookmark();", 1000); return;}
	if (bkg.last_error!="") alert(bkg.last_error);

	document.getElementById("labels").innerHTML = PrintBookmark();
	adjust_screen();
}
function RefreshBookmark(){
	bkg.load_ready = false;
	bkg.LoadBookmark();
	LoadBookmark();
}

// bookmark label object compare function
function SortBookmark(a,b){
	if (a.label == "[empty]" || b.label == "[ALL]" )
		return -1;
	if (a.label == "[ALL]" || b.label == "[empty]" )
		return 1;
	if (a.label > b.label)
		return 1;
	else if (a.label == b.label)
		return 0;
	else
		return -1;
}

function PrintBookmark(){
	bkg.all_labels.sort(SortBookmark);
	var s = new Array;
	for(pi=0; pi<bkg.all_labels.length; pi++){
		s.push( "<div class='f' id='"+ pi  +"' onclick='labelClick(this);'>" + bkg.all_labels[pi].label+"</div>");
	}
	s.push( "<div class='clear'></div>");
	return s.join("");
}

function labelClick(lnk){
  var lb = bkg.all_labels[lnk.id];
	var s = new Array;
	s.push("<ul type='disc'>");
	for (var i=0; i<lb.bookmarks.length; i++){
		s.push("<li><a href='"+ lb.bookmarks[i].href +"' target='bookmark'>"+ lb.bookmarks[i].title  +"</a></li>");
	}
	s.push("</ul>");
	$("#current_label").text(lb.label);
	$("#bookmark_list").html(s.join(""));
}
function adjust_screen(){
	$("#div_bookmarks").height($("#main").height() - $("#labels").height() - 12);
}
$(function(){
	setTimeout("LoadBookmark();",500);
	});
