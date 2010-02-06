BookmarkSearchObject.prototype = new ShowObject;
BookmarkSearchObject.prototype.constructor = BookmarkSearchObject;
function BookmarkSearchObject(){
  this.title    = "Search";
  this.key      = "search";
  
  this.search_id = 0;
  this.render = function(div){
    this.parentDiv = div;
    div.html("");
    
    this.search_field = $('<input id="bm_search" type="text">')
      .css('width','70%');
    this.search_field.val(GetState("current_search"));
    this.count = $('<span id="bm_count">')
      .attr('title',"RegExp supported. IgnoreCase default.");
    this.bms = $('<div id="bm_all">').addClass('ui-widget-content').css('padding','4px');
    this.search_div = $('<div>').append(this.search_field).append(this.count);
    var v = $('<div>').css('padding','4px').append(this.search_div).append(this.bms);
    div.append(v);
    this.resize();
    this.render_search_result(this.search_id);
    this.search_field.bind('keyup', sh_search);

  }
  
  this.resize = function(){
    this.bms.height(this.parentDiv.height() - this.search_div.height()- 22 );
  }
  this.refresh = function(){
    this.render_search_result(this.search_id);
  }  
  
  this.render_search_result = function(sid){
    var cnt = 0;
    if (sid != this.search_id) return;
    var ss = this.search_field.val();
    gbm_app.bkg.States.current_search = ss; 
    console.log("search:" + ss);
  	var reg = new RegExp(ss, "i");
  	this.bms.html("");
  	var div = $('<div class="bm-table bookmarks">');
  	
  	var w_bm = this.parentDiv.width() - 180;
  	var w_lb = 120;
		var s = [];
  	for (var i=0; i<gbm_app.bookmarks.all_bookmarks.length; i++){
      if (sid != this.search_id) {console.log("search break:" + sid); return;}
  	   
  		var bm = gbm_app.bookmarks.all_bookmarks[i];
  		if (reg==null || reg.test(bm.title) || reg.test(bm.href) || reg.test(bm.labels.join(","))){
  		  s.push("<div class='row nu mg");
        if (cnt % 2) s.push(" alt");
        s.push("'>");
        s.push("<div class='bm'><a href='");
        s.push(bm.href);
        s.push("' target='_blank' title='");
        s.push(bookmark_tips(bm));
        s.push("' style='width:");
        s.push(w_bm);
        s.push("px;'>");
        s.push(bm.title);
        s.push("<br /><span class='bm-link'>");
        s.push(bm.href);
        s.push("</span></a></div>");
        
        s.push("<div class='fixwidth lbs' style='width:");
        s.push(w_lb);
        s.push("px;'>");
        s.push(bm.labels.join(", "));
        s.push("</div>");
        
        s.push("<div class='icons'>");
        s.push("<span class='icon ui-icon ui-icon-pencil ui-corner-all' title='Edit' onclick='sh_edit("+ i +")' />");
        s.push("<span class='icon ui-icon ui-icon-trash ui-corner-all'  title='Delete' onclick='sh_dele("+ i +")' />");
        s.push("</div>");
        
        s.push("</div>");
        cnt++;
  		}
  	}
  	div.html(s.join(""));
  	this.count.text(" found:" +cnt);
  	this.bms.append(div);
    var options = { to: this.bms, className: 'ui-effects-transfer' }; 
    this.search_field.effect("transfer",options,500);
  }
  
}

function sh_search(){
  gbm_app.current_tabobj.search_id++;
  setTimeout("sh_search1(" + gbm_app.current_tabobj.search_id +")", 500);
}
function sh_search1(sid){
  var o = gbm_app.current_tabobj;
  if (o && o.key=="search"){
    o.render_search_result(sid);
  }
}

function sh_edit(bmid){
	var bm = gbm_app.bookmarks.all_bookmarks[bmid];
	gbm_app.current_edit_bm = bm;
	gbm_app.app_tabs.show_edit_tab("Edit");
}
function sh_dele(bmid){
	var bm = gbm_app.bookmarks.all_bookmarks[bmid];
	gbm_app.current_edit_bm = bm;
	gbm_app.app_tabs.show_edit_tab("Delete");
}


