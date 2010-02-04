LabelsObject.prototype = new ShowObject;
LabelsObject.prototype.constructor = LabelsObject;
function LabelsObject(){
  this.title    = "Labels";
  this.key      = "labels";
  this.bookmarks= bookmarks;
  this.render_loading = render_loading;

  this.render = function(div){
    this.parentDiv = div;
    div.html("");
    
    var d = $('<div>').css('padding','4px');
    this.btn = $('<div>');
    this.btn_and = $('<input type="radio" name="op">')
      .attr('checked','true')
      .val('and')
      .click(this.btn_clicked);
    this.btn_or = $('<input type="radio" name="op">')
      .val('or')
      .click(this.btn_clicked);
    this.btn.append(this.btn_and).append(document.createTextNode("and "))
      .append(this.btn_or).append(document.createTextNode("or"));
    
    this.acc = $('<div>');
    this.lb_cnt = $('<span>');
    var hd = $('<h3>').append($('<a>').text("Labels").append(this.lb_cnt));
    this.div_lbs = $('<div>');
    this.acc.append(hd).append($('<div>').append(this.div_lbs));    
    this.bm_cnt = $('<span>');
    var hd1 = $('<h3>').append($('<a>').text("Bookmarks").append(this.bm_cnt));
    this.div_bms = $('<div>');
    this.acc.append(hd1).append($('<div>').append(this.div_bms));
    
    d.append(this.btn).append(this.acc);
    this.acc.accordion({fillSpace: true});
    
    this.parentDiv.append(d);
    this.div_lbs.html(this.render_labels());
    d.height(this.parentDiv.height()-this.btn.height()-8).css('border','solid 1px green');
    this.acc.accordion('resize');
    
    this.div_lbs.find(".f").click(this.label_clicked);
    if (GetState("current_and_or")=="false")  this.btn_or.attr("checked",1);
    this.set_state(GetState("current_labels"));
  }
  this.resize = function(){
  }
  this.render_labels = function(){
    if (!this.bookmarks.load_ready) return "";
  	var s = [];
  	for(var i=0; i<this.bookmarks.all_labels.length; i++){
  		s.push("<div class='f' tag='"+ i  +"'>[" + this.bookmarks.all_labels[i].label+"]</div>");
  	}
  	s.push( "<div class='clear'></div>");
  	return s.join("");
  }
  
  this.label_clicked = function(){
    var o = current_tabobj;
    var lnk = $(event.target);
    lnk.toggleClass("selected");
    var lbs = o.div_lbs.find(".selected"); 
    var count = lbs.length;
    o.show_label_count(count);
  	//lnk.effect("transfer", {to:"#acc_bookmarks_cnt", className:'ui-effects-transfer'} ,500);
  	o.refresh_bookmarks();
  }
  this.btn_clicked = function(){
    var o = current_tabobj;
  	//$("#div_lb_andor").effect("transfer", {to:"#acc_bookmarks_cnt", className:'ui-effects-transfer'} ,500);
    o.refresh_bookmarks();
  }
  this.save_state = function(){
    var lbs = this.div_lbs.find(".selected");
    var s = "";
    if (lbs.length>0)
      s = $.map(lbs, function(a){return $(a).attr("tag")}).join(",");
    bkg.States.current_labels = s;
    bkg.States.current_and_or = "" + this.btn_and[0].checked;
  }   

  this.set_state  = function(state){
    if (state && state != ""){
      var l = this.div_lbs;
      $.map(state.split(','), function(a){
        var t = l.find(".f[tag="+ a +"]"); 
        t.addClass('selected');
      });
      this.refresh_bookmarks();
    }
  }
  
  this.refresh_bookmarks = function(){
    this.save_state();
      
    var lbs = this.div_lbs.find(".selected"); 
    var count = lbs.length;
  
    this.div_bms.html("");
    this.show_bookmark_count(0);
    if (count==0) return;
  
    var slb = []; 
    var found_bm = [];
    var first_label = null;
    var bm_count = 0;
    for (var i=0; i<lbs.length; i++){
      var lb = bookmarks.all_labels[$(lbs[i]).attr("tag")];
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
    if (this.btn_and[0].checked){
      // and
      if (first_label==null || first_label.bookmarks.length<1) return;
      for (var i=0; i<first_label.bookmarks.length; i++){
        bm = first_label.bookmarks[i];
        if(bm.labels.length>=count){
          if(all_in_array(slb,bm.labels)){
            this.add_bookmark(bm,found_bm);
            bm_count++;
          }       
        }        
      }
    } else {
      // or
      for(var i=0; i<bookmarks.all_bookmarks.length; i++){
        var bm = bookmarks.all_bookmarks[i];
        if(have_one_in_array(slb,bm.labels)){
          this.add_bookmark(bm,found_bm);
          bm_count++;
        }
      }
    }
   	found_bm.push("</table>");
    this.div_bms.html(found_bm.join(""));
    this.show_bookmark_count(bm_count);
  	//var w = pop_w-220; 
    //$(".nowrap1 a").width(w);
    //$(".bm_link").width(w);
    
  }
  
  this.show_bookmark_count = function(count){
    var cnt = this.bm_cnt;
    if (count==0){
      cnt.addClass("grayText");
      cnt.text("(Not found)");
    }else{
      cnt.removeClass("grayText");
      cnt.text("(Found: " + count + ")");  
    }
  }
  this.show_label_count = function(count){
    var cnt = this.lb_cnt;
    if (count==0){
      cnt.text("(Please click to select/unselect the labels.)");
      cnt.addClass("grayText");
    } else {
      cnt.text("(Selected: "+ count +")");
      cnt.removeClass("grayText");
    }
  }
  this.add_bookmark = function(bookmark, bookmarks){
    var s = bookmarks;
  	s.push("<tr><td nowrap='nowrap'>");
  	s.push("<span class='icon ui-icon ui-icon-pencil ui-corner-all' title='Edit' onclick=\"lb_edit('"+ bookmark.bm_id +"')\" />");
  	s.push("<span class='icon ui-icon ui-icon-trash ui-corner-all'  title='Delete' onclick=\"lb_dele('"+ bookmark.bm_id +"')\" />");
  	s.push("</td><td ");
  	s.push("class='nowrap1'");
  	s.push(">");
  	s.push("<a href='");
  	s.push(bookmark.href);
  	s.push("' target='bookmark' title='");
  	//s.push(BookmarkTips(bookmark));
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
}
