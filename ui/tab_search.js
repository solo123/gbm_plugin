function sh_isempty(){
  return ($("#bm_all").text()=="");
}
function sh_load(){
  $("#bm_search").val(GetState("current_search"));
  sh_search();
}
function sh_search(){
  var ss = $("#bm_search").val();
  bkg.States.current_search = ss; 
	var reg = new RegExp(ss, "i");
	var s = new Array;
	var cnt = 0;
	s.push("<table width='100%' cellspacing='0' cellpadding='0' border='0'>");
	for (var i=0; i<bkg.MyBookmarks.all_bookmarks.length; i++){
		var bm = bkg.MyBookmarks.all_bookmarks[i];
		if (reg==null || reg.test(bm.title) || reg.test(bm.href)){
			s.push("<tr><td nowrap='nowrap'>");
			s.push("<span class='icon ui-icon ui-icon-pencil ui-corner-all' title='Edit' onclick='sh_edit("+ i +")' />");
			s.push("<span class='icon ui-icon ui-icon-trash ui-corner-all'  title='Delete' onclick='sh_dele("+ i +")' />");
			s.push("</td><td ");
			s.push("class='nowrap1'");
			s.push(">");
			s.push("<a href='");
			s.push(bm.href);
			s.push("' target='bookmark' title='");
			s.push(BookmarkTips(bm));
			s.push("' >");
			s.push(bm.title);
			s.push("</a></td>");
			s.push("<td width='100'><span class='nowrap2'>");
			s.push(bm.labels.join(","));
			s.push("</span></td>");
			s.push("</tr>");
			s.push("<tr><td></td><td colspan='2'");
			s.push("<div class='bm_link'>");
			s.push(bm.href);
			s.push("</div>");
			s.push("</td></tr>");
			cnt++;
		}
	}
	s.push("</table>");
	$("#bm_count").text("(found:"+ cnt +")");
	$("#bm_all").html(s.join(""));
}

function sh_edit(bmid){
	var bm = bkg.MyBookmarks.all_bookmarks[bmid];
	OpenEditTab(bm);
}
function sh_dele(bmid){
	var bm = bkg.MyBookmarks.all_bookmarks[bmid];
	dele_show(bm);
}