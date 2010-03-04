LabelsObject.prototype = new ShowObject;
LabelsObject.prototype.constructor = LabelsObject;
function LabelsObject(){
  this.title    = "Labels";
  this.key      = "labels";
  this.on_init = true;

  this.render = function(div){
    this.parentDiv = div;
    div.html("");

    this.w_bm = div.width()-100-100;
    this.w_lb = 100;
    this.cnt = 0;
    
    this.div_acc = $('<div>').css('padding','4px');
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
    this.div_lbs = $('<div>')
      .css('margin-top','-12px')
      .css('margin-left','-20px')
      .css('margin-right','-14px')
      .disableSelection();
    this.acc.append(hd).append($('<div>').append(this.div_lbs));    
    this.bm_cnt = $('<span>');
    this.bm_tit = $('<h3>').append($('<a>').text("Bookmarks").append(this.bm_cnt));
    this.div_bms = $('<div>')
      .css('margin-top','-12px')
      .css('margin-left','-20px')
      .css('margin-right','-14px');
    this.acc.append(this.bm_tit).append($('<div>').append(this.div_bms));
    this.acc.accordion({fillSpace: true, active:1});
    
    this.div_acc.append(this.btn).append(this.acc);
    this.parentDiv.append(this.div_acc);
    this.div_lbs.html(this.render_labels());
    this.div_acc.height(this.parentDiv.height()-this.btn.height()-8);
    
    this.div_lbs.find(".f").click(this.label_clicked);
    if (GetState("current_and_or")=="false")  this.btn_or.attr("checked",1);
    this.set_state(GetState("current_labels"));
    this.on_init = false;
    this.acc.accordion('resize');
  }
  this.resize = function(){
    this.div_acc.height(this.parentDiv.height()-this.btn.height()-8);
    this.acc.accordion('resize');
  }
  this.refresh = function(){ this.refresh_bookmarks();}
  this.render_labels = function(){
    if (!gbm_app.bookmarks.load_ready) return "";
  	var s = [];
  	for(var i=0; i<gbm_app.bookmarks.all_labels.length; i++){
  		s.push("<div class='f' tag='"+ i  +"'>[" + gbm_app.bookmarks.all_labels[i].label+"]</div>");
  	}
  	s.push( "<div class='clear'></div>");
  	return s.join("");
  }
  
  this.label_clicked = function(){
    if (this.on_init) return;
    var o = gbm_app.current_tabobj;
    var lnk = $(event.target);
    lnk.toggleClass("selected");
    var lbs = o.div_lbs.find(".selected"); 
    var count = lbs.length;
    o.show_label_count(count);
  	lnk.effect("transfer", {to:o.bm_tit, className:'ui-effects-transfer'} ,500);
  	o.refresh_bookmarks();
  }
  this.btn_clicked = function(){
    if (this.on_init) return;
    var o = gbm_app.current_tabobj;
  	$(event.target).effect("transfer", {to:o.bm_tit, className:'ui-effects-transfer'} ,500);
    o.refresh_bookmarks();
  }
  this.save_state = function(){
    var lbs = this.div_lbs.find(".selected");
    var s = "";
    if (lbs.length>0)
      s = $.map(lbs, function(a){return $(a).attr("tag")}).join(",");
    gbm_app.bkg.States.current_labels = s;
    gbm_app.bkg.States.current_and_or = "" + this.btn_and[0].checked;
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
    this.cnt = 0;  
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
      var lb = gbm_app.bookmarks.all_labels[$(lbs[i]).attr("tag")];
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
    found_bm.push("<div class='bm-table'>");
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
      for(var i=0; i<gbm_app.bookmarks.all_bookmarks.length; i++){
        var bm = gbm_app.bookmarks.all_bookmarks[i];
        if(have_one_in_array(slb,bm.labels)){
          this.add_bookmark(bm,found_bm);
          bm_count++;
        }
      }
    }
   	found_bm.push("</div>");
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
  this.add_bookmark = function(bm, bookmarks){
    var s = bookmarks;
	  s.push("<div class='row nu mg");
    if (this.cnt++ % 2) s.push(" alt");
    s.push("'>");
    s.push("<div class='bm'><a href='");
    s.push(bm.href);
    s.push("' target='_blank' title='");
    s.push(bookmark_tips(bm));
    s.push("' style='width:");
    s.push(this.w_bm);
    s.push("px;'>");
    s.push(bm.title);
    s.push("<br /><span class='bm-link'>");
    s.push(bm.href);
    s.push("</span></a></div>");
    
    s.push("<div class='fixwidth lbs' style='width:");
    s.push(this.w_lb);
    s.push("px;'>");
    s.push(bm.labels.join(", "));
    s.push("</div>");
    
    s.push("<div class='icons'>");
    s.push("<span class='icon ui-icon ui-icon-pencil ui-corner-all' title='Edit' onclick='lb_edit(\""+ bm.bm_id +"\")' />");
    s.push("<span class='icon ui-icon ui-icon-trash ui-corner-all'  title='Delete' onclick='lb_dele(\""+ bm.bm_id +"\")' />");
    s.push("</div>");
    
    s.push("</div>");  	
  	
  }     
}

function lb_edit(bmid){
  var bm = gbm_app.bookmarks.GetBookmarkById(bmid);
	gbm_app.current_edit_bm = bm;
	gbm_app.app_tabs.show_edit_tab("Edit");
}
function lb_dele(bookmarkID){
  var bm = gbm_app.bookmarks.GetBookmarkById(bookmarkID);
	gbm_app.current_edit_bm = bm;
	gbm_app.app_tabs.show_edit_tab("Delete");
}