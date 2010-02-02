function sh_isempty(){
  return ($("#bm_all").text()=="");
}
function sh_load(){
  $("#bm_search").val(GetState("current_search"));
  sh_search();
}

var search_id = 0;
function sh_search(){
  search_id++;
  setTimeout("sh_search1(" + search_id +")", 500);
}
function sh_search1(sid){
  if (sid != search_id) return;
  var ss = $("#bm_search").val();
  bkg.States.current_search = ss; 
  console.log("search:" + ss);
	var reg = new RegExp(ss, "i");
	var s = new Array;
	var cnt = 0;
	s.push("<table width='100%' cellspacing='0' cellpadding='0' border='0'>");
	for (var i=0; i<bookmarks.all_bookmarks.length; i++){
	   if (sid != search_id) {console.log("search break:" + sid); return;}
		var bm = bookmarks.all_bookmarks[i];
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
			s.push("<td width='100' rowspan='2' valign='top' class='labels'>");
			s.push(bm.labels.join(", "));
			s.push("</td>");
			s.push("</tr>");
			s.push("<tr><td></td><td>");
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
	var w = LoadOption("popup_width")-210; 
  $(".nowrap1 a").width(w);
  $(".bm_link").width(w);
}

function sh_edit(bmid){
	var bm = bookmarks.all_bookmarks[bmid];
	OpenEditTab(bm);
}
function sh_dele(bmid){
	var bm = bookmarks.all_bookmarks[bmid];
	ShowBmTable(bm,"Delete");
	$("#tabs").tabs('select',3);
}
