BookmarkTabObject.prototype = new ShowObject;
BookmarkTabObject.prototype.constructor = BookmarkTabObject;
function BookmarkTabObject(){
  this.title    = "Bookmarks";
  this.key      = "bookmarks";
  
  this.render   = function(div){
    this.parentDiv = div;
    this.lbs = $('<div class="bm-labels">');
    this.bmz = $('<div class="bm-bookmarks">');
    this.bms = $('<div class="bm-table bookmarks">');
    var current_label = GetStateInt("current_label_id");
    
    div.html("");
    var d = $('<div style="padding:2px;">');
    this.render_labels(d, current_label);
    this.render_label_bookmarks(this.bms,current_label);
    this.lbs.append(d);
      
    this.lbs.css('padding','4px').disableSelection();
    this.lbs.click(this.label_onclick);
    this.bmz.addClass('ui-widget-content').css('padding','4px');
    this.bmz.append(this.bms);
    div.append(this.lbs).append(this.bmz);
  }
  this.refresh =function(){
    this.render_label_bookmarks(this.bms,GetStateInt("current_label_id"));
  }
  
  this.render_labels = function(div, selected_label){
    if (!gbm_app.bookmarks.load_ready) return;
    for (var i=0; i<gbm_app.bookmarks.all_labels.length; i++){
      var lb = $('<div>')
        .addClass('f')
        .text(gbm_app.bookmarks.all_labels[i].label)
        .attr('tag', i);
      if (selected_label>0 && i==selected_label) lb.addClass('selected');
      div.append(lb);
    }
    div.append($('<div>').addClass('clear'));
  }  
  
  this.render_label_bookmarks = function(div, label){
    div.html("");
    if (!gbm_app.bookmarks.load_ready || gbm_app.bookmarks.all_bookmarks.length<1 ) {
		div.html("no bookmarks found. <a href='http://www.google.com/bookmarks' target='_blank'>Not logged in?</a>");
		return;
	}
	if (label<0) return;

    var lb = gbm_app.bookmarks.all_labels[label];
  	var s = [];
  	for (var i=0; i<lb.bookmarks.length; i++){
  		var bm = lb.bookmarks[i];
  		s.push("<div class='row");
  		if (i % 2) s.push(" alt");
  		s.push("'>");
  
  		s.push("<div class='bm'><a href='");
  		s.push(bm.href);
  		s.push("' target='_blank' title='");
  		s.push(bookmark_tips(bm));
  		s.push("' >");
  		s.push(bm.title);
  		s.push("</a></div>");
  
      s.push("<div class='icons'>");
  		s.push("<span class='icon ui-icon ui-icon-pencil ui-corner-all' title='Edit' onclick='bm_edit("+ i +")' />");
  		s.push("<span class='icon ui-icon ui-icon-trash ui-corner-all'  title='Delete' onclick='bm_dele("+ i +")' />");
  		s.push("</div></div>");
  	}
    div.html(s.join(""));
    this.bms.find('.bm a').width(this.parentDiv.width()-76);
  }
  
  this.resize = function(){  
    if (this.lbs.height() > this.parentDiv.height()/2.5){
      this.lbs.height(Math.round(this.parentDiv.height()/2.5));
    }
    this.bmz.height(this.parentDiv.height()-this.lbs.height()-20);
  }  
  
  
  this.label_onclick = function(){
    var tag = event.srcElement;
    var o = gbm_app.current_tabobj;
    event.returnvalue = false;
    if (tag.className == "f"){
      o.lbs.find('.selected').removeClass("selected");
      var t = $(tag);
      var options = { to: ".bm-bookmarks", className: 'ui-effects-transfer' }; 
      t.effect("transfer",options,500);
      var bid = t.addClass('selected').attr('tag');
      gbm_app.bkg.States["current_label_id"] = bid;
      o.render_label_bookmarks(o.bms, bid);
    }
  }    
}

function bm_edit(bmid){
	var bm = (gbm_app.bookmarks.all_labels[GetStateInt("current_label_id")]).bookmarks[bmid];
	gbm_app.current_edit_bm = bm;
	gbm_app.app_tabs.show_edit_tab("Edit");
}
function bm_dele(bmid){
	var bm = (gbm_app.bookmarks.all_labels[GetStateInt("current_label_id")]).bookmarks[bmid];
	gbm_app.current_edit_bm = bm;
	gbm_app.app_tabs.show_edit_tab("Delete");
}



