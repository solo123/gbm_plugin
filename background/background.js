/***********************************************************************
*  Google Chrome Bookmarks Extension
*-------------------------------------------------------------------------------------
*  Create by: Jimmy Liang, 2009.12.24, Xmas eve just for fun
*  OpenSource: http://github.com/solo123/gbm_plugin.git
*
************************************************************************/
var all_labels = new Array;
var google_bookmark_base = "http://www.google.com/bookmarks/";
var load_ready = false;
var last_error = "";

// cached for popup to show.
var labels_html ="";
var bookmarks_html = "";

var current_label = "";
var current_label_id = 0;

// for delete need signature. just get from rss, don't know the best way. jimmy 2009.12.26
var sig = "";

// afterLoaded is the callback run after loaded.
function LoadBookmarkFromUrl(afterLoaded)
{
	console.log('Loading bookmarks...');
  // init 
	load_ready = false;
	last_error = "";
	all_labels = new Array;
  
	// load bookmarks xml from url:google_bookmark_base
  $.ajax({
		type: "get",
		url: google_bookmark_base,
		data: {output:"xml", num:"100000"},
		success: function(data, textStatus){
			ParseBookmarks(data);
		},
		error: function(){
			last_error += "Retrieve bookmarks error.";
			console.log("ERROR: " + last_error);
		},
		complete: function(XMLHttpRequest, textStatus){
			load_ready = true;
			console.log('Bookmarks loaded.');
			if (afterLoaded) afterLoaded();
		}
	});
  
  // load signature from url:google_bookmark_base/find?output=rss
  $.ajax({
		type: "get",
		url: google_bookmark_base + "find",
		data: {output:"rss", q:"a:false"},
		success: function(data, textStatus){
			sig = $(data).find("signature:first").text();
			console.log("Got signature:" + sig);
		},
		error: function(){
			last_error += "Retrieve signature error.";
			console.log("ERROR: " + last_error);
		}
	}); 
}

function ParseBookmarks(bookmarksXml){
	$(bookmarksXml).find("bookmark").each(function(){
		var bookmark = $(this);
    var labels = bookmark.find("label");
		var bo = {
      labels: $.map(bookmark.find("label"), function(a){return a.textContent;}).join(","), 
      bm_id: bookmark.find("id:first").text(), 
      title:   bookmark.find("title:first").text(), 
      href:   bookmark.find("url:first").text(), 
      timestamp: new Date((bookmark.find("timestamp:first").text())/1000)
    };  // bookmark object
		
		if (labels.length==0){
			AddLabel('null', bo);
		}
		else {
			labels.each(function(){	AddLabel($(this).text(), bo);	});
		}
    AddLabel('ALL', bo);
	});
  
  all_labels.sort(SortLabel); // sort labels by name
	all_labels[all_labels.length-1].bookmarks.sort(SortBookmark); // sort bookmarks in ALL by name
	labels_html = RenderLabelsHtml();  // render labels html for cache
	console.log("Bookmarks parsed.");
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

// bookmark label object compare function
function SortLabel(a,b){
	// null is the first one, and ALL is the last one.
  if (a.label == "null" || b.label == "ALL" )
		return -1;
	if (a.label == "ALL" || b.label == "null" )
		return 1;
    
	if (a.label > b.label)
		return 1;
	else if (a.label == b.label)
		return 0;
	else
		return -1;
}

// bookmark label object compare function
function SortBookmark(a,b){
	if (a.title > b.title)
		return 1;
	else if (a.title == b.title)
		return 0;
	else
		return -1;
}

function RenderLabelsHtml(){
	var s = new Array;
	for(var i=0; i<all_labels.length; i++){
		s.push( "<div class='f' id='"+ i  +"' onclick='labelClick(this);'>[" + all_labels[i].label+"]</div>");
	}
	s.push( "<div class='clear'></div>");
	return s.join("");
}

// generate bookmarks html by given label node.
function RenderBookmarksHtml(lb){
	var s = new Array;
	s.push("<table width='100%' cellspacing='0' cellpadding='2' border='0'>");
	for (var i=0; i<lb.bookmarks.length; i++){
		var bm = lb.bookmarks[i];
		var tips = bm.title + 
			'\n----------------------------------------------------------------\n' +
			'Url:       ' + bm.href   + "\n" + 
			'Labels:  ' + bm.labels + "\n" +
			'Create: ' + bm.timestamp.getFullYear() +"."
			+ bm.timestamp.getMonth() + "."
			+ bm.timestamp.getDay() + " " 
      + bm.timestamp.toTimeString() + "\n";

		s.push("<tr><td width='36'>");
		s.push("<img class='opicon' src='images/edit.png' onclick='edit_bookmark(this)'>");
		s.push("<img class='opicon' src='images/delete.png' onclick='show_dele_bookmark("+ i +")'>");
		s.push("</td><td ");
		s.push(lb.label=="ALL" ? "class='nowrap1'" : "class='nowrap'" );
		s.push(">");
		s.push("<a href='");
		s.push(bm.href);
		s.push("' target='bookmark' title='");
		s.push(tips);
		s.push("' >");
		s.push(bm.title);
		s.push("</a></td>");
		if (lb.label=="ALL"){
			s.push("<td width='100'><span class='nowrap2'>");
			s.push(bm.labels);
			s.push("</span></td>");
		}
		s.push("</tr>");
	}
	s.push("</table>");
  return s.join("");
}

function SetCurrentLabel(labelID){
  var lb = all_labels[labelID];

	current_label = lb.label;
	current_label_id = labelID;
	bookmarks_html = RenderBookmarksHtml(lb);
	console.log("Set current label to: " + lb.label);
}

$(function(){
	LoadBookmarkFromUrl();
});
