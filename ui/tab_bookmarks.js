function bm_isempty(){
  return ($("#labels > .f").length==0);
}
function bm_load(){
  $("#labels").html(bm_render_labels());
  bm_set_div_height();
  $("#bookmark_list").html(bm_render_bookmarks());
  $("#labels > .f").click(bm_label_clicked);
}
function bm_set_div_height(){
  $("#div_bookmarks").height($("#div_main").height() - $("#labels").height() - 12);
}
function bm_label_clicked(event){
  lnk = $(event.target);
  bkg.current_label_id = lnk.attr("tag");
  bm_set_div_height();
  
	$("#labels .selected").removeClass("selected");
	lnk.addClass("selected");
	$("#bookmark_list").html(bm_render_bookmarks());
	status_text("Selected label: " + lnk.text() );
	var options = { to: "#div_bookmarks", className: 'ui-effects-transfer' }; 
	lnk.effect("transfer",options,500);
}
function bm_render_labels(){
  if (!bkg.load_ready) return "";
	var s = new Array;
	for(var i=0; i<bkg.all_labels.length; i++){
		s.push("<div class='f");
		if (i==bkg.current_label_id) s.push(" selected");
    s.push("' tag='"+ i  +"'>[" + bkg.all_labels[i].label+"]</div>");
	}
	s.push( "<div class='clear'></div>");
	return s.join("");
}
function bm_render_bookmarks(){
  if (!bkg.load_ready || bkg.current_label_id<0) return "";
  
  var lb = bkg.all_labels[bkg.current_label_id];
	var s = new Array;
	s.push("<table width='100%' cellspacing='0' cellpadding='2' border='0'>");
	for (var i=0; i<lb.bookmarks.length; i++){
		var bm = lb.bookmarks[i];
		s.push("<tr><td width='56' nowrap='nowrap'>");
		s.push("<span class='icon ui-icon ui-icon-pencil ui-corner-all' title='Edit' onclick='bm_edit("+ i +")' />");
		s.push("<span class='icon ui-icon ui-icon-trash ui-corner-all'  title='Delete' onclick='bm_dele("+ i +")' />");
		s.push("</td><td class='nowrap'><a href='");
		s.push(bm.href);
		s.push("' target='bookmark' title='");
		s.push(BookmarkTips(bm));
		s.push("' >");
		s.push(bm.title);
		s.push("</a></td>");
		s.push("</tr>");
	}
	s.push("</table>");
  return s.join("");
}
function bm_edit(bmid){
	var bm = (bkg.all_labels[bkg.current_label_id]).bookmarks[bmid];
  OpenEditTab(bm);  		
}
function bm_dele(bmid){
	var bm = (bkg.all_labels[bkg.current_label_id]).bookmarks[bmid];
	dele_show(bm);
}

