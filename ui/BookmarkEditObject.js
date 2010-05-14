BookmarkEditObject.prototype = new ShowObject;
BookmarkEditObject.prototype.constructor = BookmarkEditObject;
function BookmarkEditObject(){
  this.title    = "Super class";
  this.command  = "command"
  this.key      = "add,edit,delete";

  this.render0 = function(div){
    this.parentDiv = div;
    div.html("");
    
    this.edit_table = $('<div class="bm-table" id="bm_edit">');
    var row = $('<div class="row">');
    this.div_icon = $('<div class="text-r"><img src="images/sprite.png" /></div>');
    this.div_title = $('<div>').text(this.title)
      .css('font-weight','bold');
    row.append(this.div_icon).append(this.div_title);
    this.edit_table.append(row);
    
    var lb = $('<div class="text-r">ID:</div>');
    this.div_id = $('<div>');
    row = $('<div class="row alt">').append(lb).append(this.div_id);
    this.edit_table.append(row);

    lb = $('<div class="text-r">Title:</div>');
    this.inp_title = $('<input type="text">');
    var dv = $('<div>').append(this.inp_title);
    row = $('<div class="row">').append(lb).append(dv);
    this.edit_table.append(row);

    lb = $('<div class="text-r">Url:</div>');
    this.inp_url = $('<textarea rows="4">');
    dv = $('<div>').append(this.inp_url);
    row = $('<div class="row alt">').append(lb).append(dv);
    this.edit_table.append(row);

    lb = $('<div class="text-r">Labels:</div>');
    this.inp_labels = $('<input type="text">');
    dv = $('<div>').append(this.inp_labels);
    row = $('<div class="row">').append(lb).append(dv);
    this.edit_table.append(row);

    lb = $('<div class="text-r">Create at:</div>').css('white-space','nowrap');
    this.div_create = $('<div style="font-size:80%;">');
    row = $('<div class="row alt">').append(lb).append(this.div_create);
    this.edit_table.append(row);
    
    this.btn_op = $('<input type="button">').val(this.command).click(this.do_operation);
    this.tool_box = $('<div>').append(this.btn_op);
    lb= $('<div class="text-r">').text(' ');
    dv = $('<div>').append(this.tool_box);
    row = $('<div class="row">').append(lb).append(dv);
    this.edit_table.append(row);

    this.div_main = $('<div>').css('padding','4px')
      .append( $('<span class="account"><img src="images/google.jpg" />&nbsp;<a href="https://www.google.com/accounts/ManageAccount?service=hist" class="prompt" target="_blank">My account</a> | <a href="https://www.google.com/accounts/Logout?continue=http://www.google.com" target="_blank" class="prompt">Logout</a></span>'))
      .append(this.edit_table);
    
    div.append(this.div_main);

    // auto-complete
    this.inp_labels.autocomplete(gbm_app.bookmarks.labels_auto, 
      {
        multiple: true,
    		minChars: 0,
    		autoFill: true    
      });    
  }
  this.resize = function(){}
  
  this.set_bookmark = function(bm, op){
    if (bm){
      this.div_id.text(bm.bm_id);
      this.inp_title.val(bm.title);
      this.inp_url.val(bm.href);
      this.inp_labels.val(bm.labels.join(", "));
      this.div_create.text(timestamp_tostring(bm.timestamp));
    }
  }
  this.refresh = function(){}
  this.do_operation = function(){
    gbm_app.current_tabobj.btn_op
      .attr('disabled','true')
      .val("Saving...");

	var bm = {
		bkmk : gbm_app.current_tabobj.inp_url.val(), 
		title : gbm_app.current_tabobj.inp_title.val(), 
		labels : gbm_app.current_tabobj.inp_labels.val()
	};
	gbm_app.bookmarks.SaveBookmark(bm, AfterBookmarkSaved);
  }    
}

function AfterBookmarkSaved(){
	if (gbm_app.bookmarks.load_error) {
		gbm_app.current_tabobj.btn_op
		.val(gbm_app.current_tabobj.btn_op.command);
		gbm_app.current_tabobj.btn_op.removeAttr('disabled');
		status_text('Bookmark save error!');
	} else {
		gbm_app.current_tabobj.btn_op.val("Saved.");
		status_text("Bookmark Saved.");
		gbm_app.reload();
	}
}

BookmarkAddObj.prototype = new BookmarkEditObject;
BookmarkAddObj.prototype.constructor = BookmarkAddObj;
function BookmarkAddObj(){
  BookmarkEditObject.call(this);
  this.title    = "Add Bookmark";
  this.command  = "Add bookmark";
  this.key      = "add";
  this.render = function(div){
    this.render0(div);
    this.div_title.css('color','green');

	  chrome.tabs.getSelected(null, function(ctab){
	    var l = GetStateInt("current_label_id");
	    var b = gbm_app.bookmarks; 
	    var bm = {
	       bm_id  : '',
	       href   : ctab.url,
         title  : ctab.title,
         labels : l>0 ? [b.all_labels[l].label] : [],
         timestamp : new Date()  
      };
      var bm1 = b.GetBookmarkByUrl(bm.href);
      if (bm1){
        bm.bm_id = bm1.bm_id;
        if (bm.title=="") bm.title = bm1.title;
        bm.labels = bm1.labels;
        bm.timestamp = bm1.timestamp;
      	gbm_app.current_edit_bm = bm;
		console.log("current edit title:" + bm.title);
        gbm_app.app_tabs.show_edit_tab("Edit");
        gbm_app.app_tabs.on_tab_show("edit");
      } else {
        gbm_app.current_tabobj.set_bookmark(bm,"Add");
      }
	  
	});
  }
}

BookmarkEditObj.prototype = new BookmarkEditObject;
BookmarkEditObj.prototype.constructor = BookmarkEditObj;
function BookmarkEditObj(){
  BookmarkEditObject.call(this);
  this.title    = "Edit Bookmark";
  this.command  = "Save"
  this.key      = "edit";
  
  this.render = function(div){
    this.render0(div);
    this.div_title.css('color','blue');
    this.set_bookmark(gbm_app.current_edit_bm);
  }
}

BookmarkDelObj.prototype = new BookmarkEditObject;
BookmarkDelObj.prototype.constructor = BookmarkDelObj;
function BookmarkDelObj(){
  BookmarkEditObject.call(this);
  this.title    = "Delete Bookmark";
  this.command  = "Delete it now!"
  this.key      = "delete";
  
  this.render = function(div){
    this.render0(div);
    this.div_title.css('color','red');
    this.set_bookmark(gbm_app.current_edit_bm);
  }
  this.do_operation = function(){
    gbm_app.current_tabobj.btn_op
      .attr('disabled','true')
      .val("Deleting...");
  	var bmid = gbm_app.current_tabobj.div_id.text();
	gbm_app.bookmarks.DeleteBookmark(bmid, AfterBookmarkDeleted);
  }  
}
function AfterBookmarkDeleted(){
	status_text("Bookmark deleted.");
	gbm_app.current_tabobj.btn_op.val("Deleted");
	gbm_app.reload();
}