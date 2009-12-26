var all_labels = new Array;
var google_bookmark_base = "http://www.google.com/bookmarks/";
var load_ready = false;
var last_error = "";

// for cache
var labels_html ="";
var bookmarks_html = "";

var current_label = "";
var current_label_id = 0;

// for delete need signature. just get from rss, don't know the best way. jimmy 2009.12.26
var sig = "";

function LoadBookmark(afterLoaded)
{
	console.log('Loading bookmarks...');
	load_ready = false;
	last_error = "";
	all_labels = new Array;
	$.get(google_bookmark_base, {output:"xml", num:"100000"}, function(data){
		if (data=="")
			last_error = "Retrieve bookmarks error.";
		else
			ProcessGoogleBookmark(data);
		load_ready = true;
		console.log('Bookmarks loaded.' + last_error);
		if (afterLoaded) afterLoaded();
	});
	$.get(google_bookmark_base + "find", {output:"rss", q:"a:false"}, function (data){
		sig = $(data).find("signature:first").text();
		console.log("Got signature:" + sig);
	});
}
function ProcessGoogleBookmark(bookmarksHtml){
	$(bookmarksHtml).find("bookmark").each(function(){
		var a_bookmark = $(this);
		var labels = a_bookmark.find("label");
		var title = a_bookmark.find("title:first").text();
		var href = a_bookmark.find("url:first").text();
		var bm_id = a_bookmark.find("id:first").text();
		var lbs = $.map(a_bookmark.find("label"), function(a){return a.textContent;}).join(",");
		var timestamp = new Date( (a_bookmark.find("timestamp:first").text())/1000);
		var bo = {labels:lbs, bm_id:bm_id, title:title, href:href, timestamp:timestamp};  // bookmark object
		
		if (labels.length==0){
			AddLabel('null', bo);
			AddLabel('ALL', bo);
		}
		else {
			labels.each(function(){	AddLabel($(this).text(), bo);	});
			AddLabel('ALL', bo);
		}

	});
  all_labels.sort(SortLabel); // sort labels by name
	all_labels[all_labels.length-1].bookmarks.sort(SortBookmark); // sort bookmarks in ALL by name
	labels_html = LabelsHtml();  // render labels html for cache
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

function LabelsHtml(){
	var s = new Array;
	for(var i=0; i<all_labels.length; i++){
		s.push( "<div class='f' id='"+ i  +"' onclick='labelClick(this);'>[" + all_labels[i].label+"]</div>");
	}
	s.push( "<div class='clear'></div>");
	return s.join("");
}

function SetCurrentLabel(labelID){
  var lb = all_labels[labelID];
	var s = new Array;
	s.push("<table width='100%' cellspacing='0' cellpadding='2' border='0'>");
	for (var i=0; i<lb.bookmarks.length; i++){
		var bm = lb.bookmarks[i];
		var tips = bm.title + 
			'\n----------------------------------------------------------------\n' +
			'Url:    ' + bm.href + "\n" + 
			'Labels: ' + bm.labels + "\n" +
			'Create: ' + bm.timestamp.getFullYear() +"."
			+ bm.timestamp.getMonth() + "."
			+ bm.timestamp.getDay() + " " + bm.timestamp.toTimeString() + "\n";

		s.push("<tr><td width='36'>");
		s.push("<img class='opicon' src='edit.png' onclick='edit_bookmark(this)'>");
		s.push("<img class='opicon' src='delete.png' onclick='show_dele_bookmark("+ i +")'>");
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
	current_label = lb.label;
	current_label_id = labelID;
	bookmarks_html = s.join("");
}

$(function(){
	LoadBookmark();
});
