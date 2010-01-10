function lb_isempty(){
  return ($("#acc_labels > .f").length<1); 
}
function lb_load(){
  $("#acc_labels").html(lb_render_labels());
  $('#accordion').accordion('resize');
  $("#acc_labels > .f").click(lb_label_click);
  if (GetStateInt("current_and_or")==0)  $("#acc_radio_or").attr("checked",1);
  lb_set_state(GetState("current_labels"));
}
function lb_save_state(){
  var lbs = $("#acc_labels > .selected");
  var s = "";
  if (lbs.length>0)
    s = $.map($('#acc_labels .selected'), function(a){return $(a).attr("tag")}).join(",");
  bkg.States.current_labels = s;
  bkg.States.current_and_or = $("#acc_radio_and:checked").length;
}
function lb_set_state(state){
  if (state && state != ""){
    $.map(state.split(','), function(a){$("#acc_labels .f[tag="+ a +"]").addClass('selected');});
    lb_refresh_bookmarks();
  }
}
function lb_label_click(event){
  lnk = event.target;
  $(lnk).toggleClass("selected");
  var lbs = $("#acc_labels > .selected"); 
  var count = lbs.length;
  lb_show_label_count(count);
	$(lnk).effect("transfer", {to:"#acc_bookmarks_cnt", className:'ui-effects-transfer'} ,500);
	lb_refresh_bookmarks();
}
function lb_and_or_click(){
	$("#div_lb_andor").effect("transfer", {to:"#acc_bookmarks_cnt", className:'ui-effects-transfer'} ,500);
  lb_refresh_bookmarks();
}
function lb_render_labels(){
  if (!bkg.MyBookmarks.load_ready) return "";
	var s = new Array;
	for(var i=0; i<bkg.MyBookmarks.all_labels.length; i++){
		s.push("<div class='f' tag='"+ i  +"'>[" + bkg.MyBookmarks.all_labels[i].label+"]</div>");
	}
	s.push( "<div class='clear'></div>");
	return s.join("");
}
function lb_refresh_bookmarks(){
  lb_save_state();
    
  var lbs = $("#acc_labels > .selected"); 
  var count = lbs.length;

  $("#acc_bookmarks").html("");
  lb_show_bookmark_count(0);
  if (count==0) return;

  var slb = []; 
  var found_bm = [];
  var first_label = null;
  var bm_count = 0;
  for (var i=0; i<lbs.length; i++){
    var lb = bkg.MyBookmarks.all_labels[$(lbs[i]).attr("tag")];
    slb.push(lb.label);
    if (first_label!=null){
      if (typeof(first_label.bookmarks)=="undefined") console.log("error first_bookmark");
      if (typeof(lb.bookmarks)=="undefined") console.log("error lb.bookmarks");
    }
    if (first_label==null) 
      first_label = lb;
    else{
      var len1 = first_label.bookmarks.length;
      var len2 = lb.bookmarks.length;
      if (len1>len2) first_label = lb;
    }
  }
  found_bm.push("<table width='100%' cellspacing='0' cellpadding='0' border='0'>");
  if ($("#acc_radio_and:checked").length==1){
    // and
    if (first_label==null || first_label.bookmarks.length<1) return;
    for (var i=0; i<first_label.bookmarks.length; i++){
      bm = first_label.bookmarks[i];
      if(bm.labels.length>=count){
        if(all_in_array(slb,bm.labels)){
          lb_add_bookmark(bm,found_bm);
          bm_count++;
        }       
      }        
    }
  } else {
    // or
    for(var i=0; i<bkg.MyBookmarks.all_bookmarks.length; i++){
      var bm = bkg.MyBookmarks.all_bookmarks[i];
      if(have_one_in_array(slb,bm.labels)){
        lb_add_bookmark(bm,found_bm);
        bm_count++;
      }
    }
  }
 	found_bm.push("</table>");
  $("#acc_bookmarks").html(found_bm.join(""));
  lb_show_bookmark_count(bm_count);
}
function lb_show_bookmark_count(count){
  var cnt = $("#acc_bookmarks_cnt");
  if (count==0){
    cnt.addClass("grayText");
    cnt.text("(Not found)");
  }else{
    cnt.removeClass("grayText");
    cnt.text("(Found: " + count + ")");  
  }
}
function lb_show_label_count(count){
  var cnt = $("#acc_label_cnt");
  if (count==0){
    cnt.text("(Please click to select/unselect the labels.)");
    cnt.addClass("grayText");
  } else {
    cnt.text("(Selected: "+ count +")");
    cnt.removeClass("grayText");
  }
}
function lb_add_bookmark(bookmark, bookmarks){
  var s = bookmarks;
	s.push("<tr><td nowrap='nowrap'>");
	s.push("<span class='icon ui-icon ui-icon-pencil ui-corner-all' title='Edit' onclick='lb_edit(this)' />");
	s.push("<span class='icon ui-icon ui-icon-trash ui-corner-all'  title='Delete' onclick=\"lb_dele('"+ bookmark.bm_id +"')\" />");
	s.push("</td><td ");
	s.push("class='nowrap1'");
	s.push(">");
	s.push("<a href='");
	s.push(bookmark.href);
	s.push("' target='bookmark' title='");
	s.push(BookmarkTips(bookmark));
	s.push("' >");
	s.push(bookmark.title);
	s.push("</a></td>");
	s.push("<td width='100'><span class='nowrap2'>");
	s.push(bookmark.labels.join(","));
	s.push("</span></td>");
	s.push("</tr>");
	s.push("<tr><td></td><td colspan='2'");
	s.push("<div class='bm_link'>");
	s.push(bookmark.href);
	s.push("</div>");
	s.push("</td></tr>");
}

function lb_edit(node){
  var lnk = $(node).parent().parent().find("a:first").attr("href");
  var bm = {href: lnk};
  OpenEditTab(bm);
}
function lb_dele(bookmarkID){
  var bm = bkg.FindBookmarkById(bookmarkID);
  if (bm==null){
    bm = {
      href: "",
      title: "",
      bm_id: bookmarkID,
      labels: [""],
      timestamp: ""
    };
  }
  dele_show(bm);
}

function string_in_array(str,arr){
  for(var i in arr){
    if (str==arr[i]) return true;
  }
  return false;
}
function all_in_array(srcArr, tagArr){
  for(var i in srcArr){
    if (!string_in_array(srcArr[i],tagArr))
      return false;
  }
  return true;
}
function have_one_in_array(srcArr, tagArr){
  for(var i in srcArr){
    if (string_in_array(srcArr[i],tagArr)) return true;
  }
  return false;
}