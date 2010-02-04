function dele_bookmark(){
	var bmid = $("#bm_id").text();
	console.log("Delete:(" + bmid + ")");
 	$.post(bkg.GOOGLE_BOOKMARK_BASE + "mark", {dlq: bmid, sig:bookmarks.sig}, function(data){
	 		console.log("delete success:" + data);
			bookmarks.LoadBookmarkFromUrl(AfterBookmarkLoaded);
			status_text("Bookmark deleted: " + bmid);
	 	}, "text");	
	$("#tabs").tabs('select',bkg.States.previous_tab);
}
function cancel_dele(){
	$("#tabs").tabs('select',bkg.States.previous_tab);
}