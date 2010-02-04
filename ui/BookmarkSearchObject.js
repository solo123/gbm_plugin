BookmarkSearchObject.prototype = new ShowObject;
BookmarkSearchObject.prototype.constructor = BookmarkSearchObject;
function BookmarkSearchObject(){
  this.title    = "Search";
  this.key      = "search";
  this.bookmarks= bookmarks;
  this.render_loading = render_loading;
  
  this.search_id = 0;
  this.render = function(div){
    if (!this.bookmarks.load_ready) return this.render_loading();
    this.parentDiv = div;
    div.html("");
    
    this.search_field = $('<input id="bm_search" type="text">')
      .css('width','70%')
      .bind('keyup', sh_search);
    this.count = $('<span id="bm_count">')
      .attr('title',"RegExp supported. IgnoreCase default.");
    this.bms = $('<div id="bm_all">').addClass('ui-widget-content').css('padding','4px');
    this.search_div = $('<div>').append(this.search_field).append(this.count);
    var v = $('<div>').css('padding','4px').append(this.search_div).append(this.bms);
    div.append(v);
    this.resize();
    
    this.search_field.val(load_option('search_text'));
    this.render_search_result(this.search_id);
  }
  
  this.resize = function(){
    this.bms.height(this.parentDiv.height() - this.search_div.height()- 22 );
  }  
  
  this.render_search_result = function(sid){
    var cnt = 0;
    if (sid != this.search_id) return;
    var ss = this.search_field.val();
    bkg.States.current_search = ss; 
    console.log("search:" + ss);
  	var reg = new RegExp(ss, "i");
  	this.bms.html("");
  	var div = $('<div class="bm-table">');
  	
  	var w_bm = this.parentDiv.width() - 180;
  	status_text("p:"+w_bm)
  	var w_lb = 120;
  	for (var i=0; i<this.bookmarks.all_bookmarks.length; i++){
      if (sid != this.search_id) {console.log("search break:" + sid); return;}
  	   
  		var bm = this.bookmarks.all_bookmarks[i];
  		if (reg==null || reg.test(bm.title) || reg.test(bm.href) || reg.test(bm.labels.join(","))){
  		  var row = $('<div>').addClass('row');
  		  if (i % 2) row.addClass('alt');
  		  var col1 = $('<div>').addClass('icons')
  		    .append($("<span class='icon ui-icon ui-icon-pencil ui-corner-all' title='Edit' onclick='sh_edit("+ i +")' />"))
  		    .append($("<span class='icon ui-icon ui-icon-trash ui-corner-all'  title='Delete' onclick='sh_dele("+ i +")' />"));
  		  var col2 = $('<div>').addClass('bm');
  		  var ancr = $('<a>')
  		    .attr('href',bm.href)
          .attr('target', '_blank')
          .html(bm.title + "<br /><span class='bm-link'>" + bm.href + "</span>")
          .attr('title', bookmark_tips(bm))
          .width(w_bm)
          .addClass('nu mg');
        var col3 = $('<div class="fixwidth lbs">')
          .text(bm.labels.join(", "));
        var col4 = $('<span>').text(bm.href).addClass('bm-link');
        col2.append(ancr);
        col3.width(w_lb);
        row.append(col2).append(col3).append(col1);
        this.bms.append(row);
        cnt++;
  		}
  	}
  	this.count.text(" found:" +cnt);
    var options = { to: this.bms, className: 'ui-effects-transfer' }; 
    this.search_field.effect("transfer",options,500);
  }
  
}

function sh_search(){
  current_tabobj.search_id++;
  setTimeout("sh_search1(" + current_tabobj.search_id +")", 500);
}
function sh_search1(sid){
  var o = current_tabobj;
  if (o && o.key=="search"){
    o.render_search_result(sid);
  }
}


