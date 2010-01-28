/***********************************************************************
*  Google Chrome Bookmarks Extension
*-------------------------------------------------------------------------------------
*  Create by: Jimmy Liang, 2009.12.24, Xmas eve just for fun
*  OpenSource: http://github.com/solo123/gbm_plugin.git
*
************************************************************************/
// public vars
var GOOGLE_BOOKMARK_BASE = "http://www.google.com/bookmarks/";

var MyBookmarks = {
  load_ready: false,
  load_error: false,
  error_message: "",
  // for delete need signature. just get from rss, don't know the best way. jimmy 2009.12.26
  sig: ""
};
var States = {};
var current_load_ajax = null;

// afterLoaded is the callback run after loaded.
function LoadBookmarkFromUrl(afterLoaded)
{
  States.current_tab = States.previous_tab = 0;
  MyBookmarks.load_ready = false;
  MyBookmarks.load_error = false;
  MyBookmarks.error_message = "";
  MyBookmarks.all_labels = new Array;
  MyBookmarks.all_bookmarks = new Array;
  
	// load bookmarks xml from url:GOOGLE_BOOKMARK_BASE
	if (current_load_ajax) current_load_ajax.abort();
  current_load_ajax = $.ajax({
		type: "get",
		url: GOOGLE_BOOKMARK_BASE,
		data: {output:"xml", num:"100000"},
		success: function(data, textStatus){
			ParseBookmarks(data);
			MyBookmarks.load_ready = true;
			// -- for test. LoadLotsBookmarks();
			if (afterLoaded) afterLoaded();
		},
		error: function(){
		  MyBookmarks.load_error = true;
			MyBookmarks.error_message += "Retrieve bookmarks error.";
			console.error(MyBookmarks.error_message);
			if (afterLoaded) afterLoaded();
		},
		complete: function(XMLHttpRequest, textStatus){
		  current_load_ajax = null;
			console.log('Bookmarks loaded.');
		}
	});
	
	LoadSig();
}
function LoadSig(){
  // load signature from url:GOOGLE_BOOKMARK_BASE/find?output=rss
  $.ajax({
		type: "get",
		url: GOOGLE_BOOKMARK_BASE + "find",
		data: {output:"rss", q:"a:false"},
		success: function(data, textStatus){
			MyBookmarks.sig = $(data).find("signature:first").text();
			console.log("Got signature:" + MyBookmarks.sig);
		},
		error: function(){
			MyBookmarks.error_message += "Retrieve signature error.";
			console.error(MyBookmarks.error_message);                   
		}
	}); 
}

function FindBookmarkById(bookmarkID){
  for(var i=0; i<MyBookmarks.all_bookmarks.length; i++){
    if (MyBookmarks.all_bookmarks[i].bm_id == bookmarkID)
      return MyBookmarks.all_bookmarks[i];
  }
  return null;
}

//------------- private functions blow -----------------------
function ParseBookmarks(bookmarksXml){
	$(bookmarksXml).find("bookmark").each(function(){
		var bookmark = $(this);
    var lbo = [];
    var labels = bookmark.find("label");
    for(var i=0; i<labels.length; i++){
      lbo.push(labels[i].textContent);
    }
		var bo = {
      labels: lbo, 
      bm_id: bookmark.find("id:first").text(), 
      title:   bookmark.find("title:first").text(), 
      href:   bookmark.find("url:first").text(), 
      timestamp: new Date((bookmark.find("timestamp:first").text())/1000)
    };  // bookmark object
		
		if (labels.length==0){
			AddLabel('blank', bo);
		}
		else {
			labels.each(function(){	AddLabel($(this).text(), bo);	});
		}
    MyBookmarks.all_bookmarks.push(bo);
	});
  
  MyBookmarks.all_labels.sort(SortLabel); // sort labels by name
	MyBookmarks.all_bookmarks.sort(SortBookmark); // sort bookmarks in ALL by name
	console.log("Bookmarks parsed.");
}

function AddLabel(label, bookmark){
	var lb = null;
	// search if the label exist.
	for (var i=0; i<MyBookmarks.all_labels.length; i++){
		if (MyBookmarks.all_labels[i].label == label ){
			lb = MyBookmarks.all_labels[i];
			break;
		}
	}
	// add new label
	if (lb==null){
		lb = new Object;
		lb.label = label;
		lb.bookmarks = new Array();
		MyBookmarks.all_labels.push(lb);
	}
	// save bookmark
	lb.bookmarks.push(bookmark);
}

// bookmark label object compare function
function SortLabel(a,b){
	// null is the first one, and ALL is the last one.
  if (a.label == "blank" || b.label == "ALL" )
		return -1;
	if (a.label == "ALL" || b.label == "blank" )
		return 1;
    
	if (a.label.toUpperCase() > b.label.toUpperCase())
		return 1;
	else if (a.label.toUpperCase() == b.label.toUpperCase())
		return 0;
	else
		return -1;
}

// bookmark label object compare function
function SortBookmark(a,b){
	if (a.title.toUpperCase() > b.title.toUpperCase())
		return 1;
	else if (a.title.toUpperCase() == b.title.toUpperCase())
		return 0;
	else
		return -1;
}

// for test
function LoadLotsBookmarks(){
  for(var i=0; i<100; i++){
		var bo = {
      labels: "label" + i, 
      bm_id: "id:i", 
      title:  "My label " + i, 
      href:   "href:" + i, 
      timestamp: new Date()
    };  // bookmark object
    AddLabel("label"+i, bo);
  }
}

function GetBookmarkByUrl(url){
  if (MyBookmarks.all_bookmarks){
    var u = url.toUpperCase();
    for(var i=0; i<MyBookmarks.all_bookmarks.length; i++){
      if (MyBookmarks.all_bookmarks[i].href.toUpperCase() == u)
        return MyBookmarks.all_bookmarks[i];
    }
  }
  return null;
}

