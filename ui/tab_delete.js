function dele_show(bm){
	$("#tabs").tabs('enable', 4).tabs('select',4);
  $("#dele_url").text(bm.href);
  $("#dele_title").text(bm.title);
  $("#dele_id").text(bm.bm_id);
  $("#dele_label").text(bm.labels.join(""));
  $("#dele_time").text(bm.timestamp.getFullYear() +"."
			+ bm.timestamp.getMonth() + "."
			+ bm.timestamp.getDay() + " " + bm.timestamp.toTimeString() );
}
function dele_bookmark(bmid){
	var bmid = $("#dele_id").text();
	console.log("Delete:(" + bmid + ")");
 	$.post(bkg.google_bookmark_base + "mark", {dlq: bmid, sig:bkg.sig}, function(data){
	 		console.log("delete success:" + data);
	 		bkg.bookmarks_html = "";
			bkg.LoadBookmarkFromUrl(AfterBookmarkLoaded);
			status_text("Bookmark deleted: " + bmid);
	 	}, "text");	
	$("#tabs").tabs('select',0);
}
function cancel_dele(){
	$("#tabs").tabs('select',0);
}