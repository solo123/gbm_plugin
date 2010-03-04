BookmarkEditObject.prototype = new ShowObject;
BookmarkEditObject.prototype.constructor = BookmarkEditObject;
function BookmarkEditObject(){
  this.title    = "Super class";
  this.command  = "command"
  this.key      = "add,edit,delete";

  this.render0 = function(div){
    this.parentDiv = div;
    div.html("");
    this.popup    = $('<iframe>');
    this.popup.attr("width",div.width()).attr("height",div.height()-20).css("margin","4px");
    div.append(this.popup);
  }
  this.resize = function(){}
  this.refresh = function(){}
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
	  chrome.tabs.getSelected(null, function(ctab){
	    var l = GetStateInt("current_label_id");
	    var b = gbm_app.bookmarks; 
	    var bm = {
	       bm_id  : '',
	       href   : ctab.url,
         title  : ctab.title,
         labels : l>0 ? [b.all_labels[l].label] : []
      };
      gbm_app.current_tabobj.popup[0].src = gbm_app.bkg.GOOGLE_BOOKMARK_BASE +
        "mark?output=popup&op=add&bkmk="+encodeURI(bm.href)
        +"&title="+encodeURI(bm.title)+"&labels=" + encodeURI(bm.labels);
      
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
    var bm = gbm_app.current_edit_bm; 
    gbm_app.current_tabobj.popup[0].src = gbm_app.bkg.GOOGLE_BOOKMARK_BASE 
      +"mark?output=popup&op=edit&bkmk="+encodeURI(bm.href)
      +"&title="+encodeURI(bm.title)+"&labels=" + encodeURI(bm.labels);
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
    var bm = gbm_app.current_edit_bm; 
    gbm_app.current_tabobj.popup[0].src = gbm_app.bkg.GOOGLE_BOOKMARK_BASE 
      +"mark?output=popup&op=edit&bkmk="+encodeURI(bm.href)
      +"&title="+encodeURI(bm.title)+"&labels=" + encodeURI(bm.labels);
  }
}