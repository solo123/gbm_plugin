var all_labels = new Array;
var current_url, current_title;
var google_bookmark_xml = "http://www.google.com/bookmarks/?output=xml&num=100000";
var google_bookmark_add = "http://www.google.com/bookmarks/mark?op=edit&output=popup";
var load_ready = false;
var last_error = "";

function LoadBookmark()
{
	load_ready = false;
	last_error = "";
	all_labels = new Array;
	$.get(google_bookmark_xml, function(data){
		if (data=="")
			last_error = "Retrieve bookmarks error.";
		else
			ProcessGoogleBookmark(data);
		load_ready = true;
	});
}
function ProcessGoogleBookmark(bookmarksHtml){
	$(bookmarksHtml).find("bookmark").each(function(){
		var a_bookmark = $(this);
		var labels = a_bookmark.find("label");
		var title = a_bookmark.find("title:first").text();
		var href = a_bookmark.find("url:first").text();
		
		if (labels.length==0){
			AddLabel('[empty]', {title:title, href:href} );
			AddLabel('[ALL]', {title:title, href:href});
		}
		else {
		    var ss = new Array;
			labels.each(function(){
				AddLabel('['+$(this).text()+']', {title:title, href:href});
				ss.push($(this).text());
			});
			AddLabel('[ALL]', {title:"["+ ss.join(",")  +"] " + title, href:href});
		}

	});
}

function AddLabel(label, bookmark){
	var lb = null;
	// search if the label exist.
	for (var i=0; i<all_labels.length; i++){
		if (all_labels[i].label == label ){
			lb = all_labels[i];
			break;
		}
	}
	// add new label
	if (lb==null){
		lb = new Object;
		lb.label = label;
		lb.bookmarks = new Array();
		all_labels.push(lb);
	}
	// save bookmark
	lb.bookmarks.push(bookmark);
}


$(function(){
	setTimeout("LoadBookmark();",500);
	});
