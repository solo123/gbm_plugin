/***********************************************************************
*  Google Chrome Bookmarks Extension
*-------------------------------------------------------------------------------------
*  Create by: Jimmy Liang, 2009.12.24, Xmas eve just for fun
*  OpenSource: http://github.com/solo123/gbm_plugin.git
*
************************************************************************/
var gbm = null;
var States = {}; // to save popup states.
function GoogleBookmark(){
	// public vars
	this.BOOKMARK_URL = "https://www.google.com/bookmarks/";
	this.load_ready = false;
	this.load_error = false;
	this.error_message = "";
	this.sig = "";

	// for delete need signature. just get from rss, don't know the best way. jimmy 2009.12.26
	this.load_handle = null;
	this.all_labels = [];
	this.all_bookmarks = [];
	this.labels_auto = [];
	
	this.IsNotEmpty = function(){
		return this.load_ready && this.all_bookmarks && this.all_bookmarks.length>0;
	}
	this.Clear = function(){
		this.load_ready = false;
		this.load_error = false;
		this.error_message = "";
		this.sig = "";
		
		this.all_labels = [];
		this.all_bookmarks = [];
		this.labels_auto = [];
	}
	// afterLoaded is the callback run after loaded.
	this.LoadBookmarks = function(afterLoaded)
	{
		this.load_ready = false;
		this.load_error = false;
		this.error_message = "";
	  
	    console.log("loading...");
		// load bookmarks xml from url:BOOKMARK_URL
		if (this.load_handle) this.load_handle.abort();
		this.load_handle = $.ajax({
			type: "get",
			url: this.BOOKMARK_URL,
			data: {output:"xml", num:"100000"},
			success: function(data, textStatus){
				if (gbm) {
					gbm.ParseBookmarks(data);
					gbm.load_ready = true;
				}
				if (afterLoaded) afterLoaded();
			},
			error: function(){
				if (gbm) {
					gbm.load_ready = true;
					gbm.load_error = true;
					gbm.error_message += "Retrieve bookmarks error.";
				}
				if (afterLoaded) afterLoaded();
			},
			complete: function(XMLHttpRequest, textStatus){
				if (gbm) {
					gbm.load_handle = null;
				}
				console.log('Bookmarks loaded.');
			}
		});
		this.LoadSig();
	}
	
	this.LoadSig = function(){
	  // load signature from url:GOOGLE_BOOKMARK_BASE/find?output=rss
	  $.ajax({
			type: "get",
			url: this.BOOKMARK_URL + "find",
			data: {output:"rss", q:"a:false"},
			success: function(data, textStatus){
				if (gbm) gbm.sig = $(data).find("signature:first").text();
				console.log("Got signature:" + gbm.sig);
			},
			error: function(){
				if (gbm) {
					gbm.load_error = true;
					gbm.error_message += "Retrieve signature error.";
				}
			}
		}); 
	}
	
	this.SaveBookmark = function(bm, afterSaved){
		$.ajax({
			type: "post",
			url: this.BOOKMARK_URL + "mark",
			data: {
				bkmk : bm.bkmk, 
				prev : '', 
				title : bm.title, 
				labels : bm.labels, 
				sig : this.sig
			},
			success: function(data, textStatus){
				this.load_error = false;
			},
			error: function(){
				this.load_error = true;
			},
			complete: function(){
				if (afterSaved) afterSaved();
			}
		});
	}
	
	this.DeleteBookmark = function(bmid, afterDeleted){
		console.log("deleting...");
		$.post(
			this.BOOKMARK_URL + "mark", 
			{dlq: bmid, sig:this.sig}, 
			function(data){
				console.log("call back");
				if (afterDeleted) afterDeleted();
			}, 
			"text"
		);
	}
	
	
	this.GetBookmarkById = function(bookmarkID){
	  for(var i=0; i<this.all_bookmarks.length; i++){
		if (this.all_bookmarks[i].bm_id == bookmarkID)
		  return this.all_bookmarks[i];
	  }
	  return null;
	}

	this.GetBookmarkByUrl = function(url){
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
	this.ParseBookmarks = function(bookmarksXml){
		this.all_labels = [];
		this.all_bookmarks = [];
		this.labels_auto = [];

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
				title: bookmark.find("title:first").text(), 
				href:  bookmark.find("url:first").text(), 
				timestamp: new Date((bookmark.find("timestamp:first").text())/1000)
			};  // bookmark object
			
			if (labels.length==0){
				gbm.AddLabel('blank', bo);
			}
			else {
				labels.each(function(){	
					gbm.AddLabel($(this).text(), bo);	
				});
			}
			gbm.all_bookmarks.push(bo);
		});
	  
		this.all_labels.sort(this.SortLabel); // sort labels by name
		this.all_bookmarks.sort(this.SortBookmark); // sort bookmarks in ALL by name
		console.log("Bookmarks parsed.");
	}

	this.AddLabel = function(label, bookmark){
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
			if (label!="blank") this.labels_auto.push(label);
		}
		// save bookmark
		lb.bookmarks.push(bookmark);
	}

	// bookmark label object compare function
	this.SortLabel = function(a,b){
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
	this.SortBookmark = function(a,b){
		if (a.title.toUpperCase() > b.title.toUpperCase())
			return 1;
		else if (a.title.toUpperCase() == b.title.toUpperCase())
			return 0;
		else
			return -1;
	}
}
gbm = new GoogleBookmark();

