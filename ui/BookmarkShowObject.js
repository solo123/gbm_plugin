BookmarkTabObject.prototype = new ShowObject;
BookmarkTabObject.prototype.constructor = BookmarkTabObject;
function BookmarkTabObject(){
  this.title    = "Bookmarks";
  this.key      = "bookmarks";
  this.bookmarks= bookmarks;
  this.render_loading = render_loading;
  
  this.render   = function(div){
    if (!this.bookmarks.load_ready) return this.render_loading();
    
    this.parentDiv = div;
    this.lbs = $('<div class="bm-labels">');
    this.bmz = $('<div class="bm-bookmarks">');
    this.bms = $('<div class="bm-table">');
    var current_label = GetStateInt("current_label_id");
    
    div.html("");
    this.render_labels(this.lbs, current_label);
    this.render_label_bookmarks(this.bms,current_label);
      
    this.lbs.css('padding','4px');
    this.lbs.click(this.label_onclick);
    this.bmz.addClass('ui-widget-content').css('padding','4px');
    this.bmz.append(this.bms);
    div.append(this.lbs).append(this.bmz);
  }
  
  this.render_labels = function(div, selected_label){
    if (!this.bookmarks.load_ready) return;
    for (var i=0; i<this.bookmarks.all_labels.length; i++){
      var lb = $('<div>');
      lb.addClass('f').text(this.bookmarks.all_labels[i].label);
      lb.attr('tag', i);
      if (selected_label>0 && i==selected_label) lb.addClass('selected');
      div.append(lb);
    }
    div.append($('<div>').addClass('clear'));
  }  
  
  this.render_label_bookmarks = function(div, label){
    div.html("");
    if (!this.bookmarks.load_ready || label<0) return;
    var lb = this.bookmarks.all_labels[label];
    if (!lb || lb.bookmarks.length<1) return;
  	for (var i=0; i<lb.bookmarks.length; i++){
  		var bm = lb.bookmarks[i];
  		var row = $('<div>').addClass('row');
  		if(i % 2) row.addClass('alt');
  		var col1 = $('<div>').addClass('icons')
        .append($("<span class='icon ui-icon ui-icon-pencil ui-corner-all' title='Edit' onclick='bm_edit("+ i +")' />"))
        .append($("<span class='icon ui-icon ui-icon-trash ui-corner-all'  title='Delete' onclick='bm_dele("+ i +")' />"))
      var col2 = $('<div>').addClass('bm');
      var ancr = $('<a>')
        .attr('href',bm.href)
        .attr('target','_blank')
        .text(bm.title)
        .attr('title', bookmark_tips);
        
      col2.append(ancr);
      row.append(col2).append(col1); 
      div.append(row);
    }  
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
    var o = current_tabobj;
    event.returnvalue = false;
    if (tag.className == "f"){
      o.lbs.find('.selected').removeClass("selected");
      var t = $(tag);
      var options = { to: ".bm-bookmarks", className: 'ui-effects-transfer' }; 
      t.effect("transfer",options,500);
      var bid = t.addClass('selected').attr('tag');
      bkg.States["current_label_id"] = bid;
      o.render_label_bookmarks(o.bms, bid);
    }
  
   viewportheight = document.documentElement.clientHeight
   status_text("viewportheight:"+ viewportheight +", top:" + div_top.height() + ", main:"+div_main.height() + ", footer:"+div_footer.height()+", config:"+config.height );
  }    
}




