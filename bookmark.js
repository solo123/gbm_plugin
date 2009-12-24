var bkg = chrome.extension.getBackgroundPage();
var retry = 0;

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

	if (!bkg.load_ready){ 
	    if (retry>5)
			RefreshBookmark();
		else
		    setTimeout("LoadBookmark();", 1000); 
		retry = retry + 1;
		return;
	}
	if (bkg.last_error!="") alert(bkg.last_error);

	document.getElementById("labels").innerHTML = PrintBookmark();
	adjust_screen();
}
function RefreshBookmark(){
	retry = 0;
	bkg.load_ready = false;
	bkg.LoadBookmark();
	LoadBookmark();
}

function PrintBookmark(){
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
