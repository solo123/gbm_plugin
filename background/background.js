/***********************************************************************
*  Google Chrome Bookmarks Extension
*-------------------------------------------------------------------------------------
*  Create by: Jimmy Liang, 2009.12.24, Xmas eve just for fun
*  OpenSource: http://github.com/solo123/gbm_plugin.git
*
************************************************************************/
// public vars
var GOOGLE_BOOKMARK_BASE = "http://www.google.com/bookmarks/";
var States = {};
var bookmarks = {
  load_ready: false,
  load_error: false,
  error_message: "",
  // for delete need signature. just get from rss, don't know the best way. jimmy 2009.12.26
  sig: "",
  load_handle: null
};
var _bm_url = localStorage["bookmark_url"];
if (_bm_url && _bm_url.length>5) GOOGLE_BOOKMARK_BASE = _bm_url;

// afterLoaded is the callback run after loaded.
bookmarks.LoadBookmarkFromUrl = function(afterLoaded)
{
  this.load_ready = false;
  this.load_error = false;
  this.error_message = "";
  this.all_labels = [];
  this.all_bookmarks = [];
  
	// load bookmarks xml from url:GOOGLE_BOOKMARK_BASE
	if (this.load_handle) this.load_handle.abort();
  this.load_handle = $.ajax({
		type: "get",
		url: GOOGLE_BOOKMARK_BASE,
		data: {output:"xml", num:"100000"},
		success: function(data, textStatus){
			bookmarks.ParseBookmarks(data);
			bookmarks.load_ready = true;
			if (afterLoaded) afterLoaded();
		},
		error: function(){
		  bookmarks.load_ready = true;
		  bookmarks.load_error = true;
			bookmarks.error_message += "Retrieve bookmarks error.";
			console.error(this.error_message);
			if (afterLoaded) afterLoaded();
		},
		complete: function(XMLHttpRequest, textStatus){
		  bookmarks.load_handle = null;
			console.log('Bookmarks loaded.');
		}
	});
	
	this.LoadSig();
}
bookmarks.LoadSig = function(){
  // load signature from url:GOOGLE_BOOKMARK_BASE/find?output=rss
  $.ajax({
		type: "get",
		url: GOOGLE_BOOKMARK_BASE + "find",
		data: {output:"rss", q:"a:false"},
		success: function(data, textStatus){
			bookmarks.sig = $(data).find("signature:first").text();
			console.log("Got signature:" + bookmarks.sig);
		},
		error: function(){
		  bookmarks.load_error = true;
			bookmarks.error_message += "Retrieve signature error.";
			console.error(this.error_message);                   
		}
	}); 
}

bookmarks.GetBookmarkById = function(bookmarkID){
  for(var i=0; i<this.all_bookmarks.length; i++){
    if (this.all_bookmarks[i].bm_id == bookmarkID)
      return this.all_bookmarks[i];
  }
  return null;
}
bookmarks.GetBookmarkByUrl = function(url){
  if (this.all_bookmarks){
    var u = url.toUpperCase();
    for(var i=0; i<this.all_bookmarks.length; i++){
      if (this.all_bookmarks[i].href.toUpperCase() == u)
        return this.all_bookmarks[i];
    }
  }
  return null;
}
//------------- private functions blow -----------------------
bookmarks.ParseBookmarks = function(bookmarksXml){
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
			bookmarks.AddLabel('blank', bo);
		}
		else {
			labels.each(function(){	bookmarks.AddLabel($(this).text(), bo);	});
		}
    bookmarks.all_bookmarks.push(bo);
	});
  
  this.all_labels.sort(this.SortLabel); // sort labels by name
	this.all_bookmarks.sort(this.SortBookmark); // sort bookmarks in ALL by name
	console.log("Bookmarks parsed.");
}

bookmarks.AddLabel = function(label, bookmark){
	var lb = null;
	// search if the label exist.
	for (var i=0; i<this.all_labels.length; i++){
		if (this.all_labels[i].label == label ){
			lb = this.all_labels[i];
			break;
		}
	}
	// add new label
	if (lb==null){
		lb = new Object;
		lb.label = label;
		lb.bookmarks = new Array();
		this.all_labels.push(lb);
	}
	// save bookmark
	lb.bookmarks.push(bookmark);
}

// bookmark label object compare function
bookmarks.SortLabel = function(a,b){
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
bookmarks.SortBookmark = function(a,b){
	if (a.title.toUpperCase() > b.title.toUpperCase())
		return 1;
	else if (a.title.toUpperCase() == b.title.toUpperCase())
		return 0;
	else
		return -1;
}


