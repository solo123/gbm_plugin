function BookmarkApp(){
  var tabs = load_option("tabs");
  this.config = {
    width    : parseInt(load_option("width")),
    height   : parseInt(load_option("height")),
    font_size: load_option("font_size"),
    tabs     : (tabs && tabs.length>0 ? tabs.split(",") : ["Bookmarks", "Search", "Add","Tools"])
  };
  
  this.tabsobj = [
    new BookmarkTabObject(), 
    new BookmarkSearchObject(), 
    new LabelsObject(), 
    new BookmarkAddObj(),
    new BookmarkEditObj(),
    new BookmarkDelObj(),
    new ToolsObject()
  ];
  
  this.start_up = function(div){
    this.bkg = chrome.extension.getBackgroundPage();  // ref to background.html
    this.bookmarks = this.bkg.gbm;
    this.parentDiv = div;
    div.css('font-size',this.config.font_size);
    this.load_bookmarks();
  }
  this.load_bookmarks = function(){
    if (!this.bookmarks.load_ready){
      this.load_data();
    } else {
      this.render_main();
    }
  }
  this.load_data = function(){
    this.render_loading();
    this.bookmarks.LoadBookmarks(function(){
      var o = gbm_app;
      if (o.bookmarks.load_error)
        o.render_error();
      else
        o.render_main();
    });
  }
  
  this.render_main = function(){
    this.div_top = $('<div>');
    this.div_main = $('<div class="main">');
    this.div_footer = $('<div class="footer">');
    this.parentDiv.html("").append(this.div_top).append(this.div_main).append(this.div_footer);
    var h = this.config.height - this.div_top.height() - this.div_footer.height(); 
    this.div_main.height(h);
    this.div_top.width(this.config.width);
    this.div_main.width(this.config.width);
    this.div_footer.width(this.config.width);

    this.app_tabs = new ApplicationTabs();
    this.app_tabs.div_main = this.div_main;
    this.app_tabs.on_tab_show = function(tab){
      for(var i=0; i<gbm_app.tabsobj.length; i++){
        if (tab == gbm_app.tabsobj[i].key){
          gbm_app.current_tabobj = gbm_app.tabsobj[i];
          gbm_app.current_tabobj.render(gbm_app.div_main);
          gbm_app.current_tabobj.resize();
          break;
        }
      }    
    };
    this.app_tabs.render_tabs(this.div_top, this.config.tabs);
    
    this.reload = function(){
      if (this.bookmarks.all_bookmarks.length<1)
        this.load_data();
      else {
        status_text("reload bookmarks...")
        this.bookmarks.LoadBookmarks(function(){
          status_text("Bookmark loaded.");
          gbm_app.current_tabobj.refresh();
        });
      }    
    }
    
    this.render_status();
    this.resize_divs();
  }

  this.render_loading = function(){
    var s = '\
<div class="ui-widget" style="width:280px;margin:auto;font-size:14px;padding:4px;">\
	<div style="padding:0.7em;" class="ui-state-highlight ui-corner-all"> \
		<p> \
  		<img src="images/indicator.gif" /> \
  		<strong>&nbsp;Loading Google Bookmarks...</strong><br /> \
  		<br /> \
  		&nbsp;<a href="http://www.google.com/bookmarks" target="_blank">Not logged in?</a> \
    </p> \
	</div> \
</div>';
    this.parentDiv.css('border','solid 1px transparent').html(s);
  }
  this.render_error = function(){
    var s = '\
<div class="ui-widget" style="width:280px;margin:auto;font-size:14px;padding:4px;">\
	<div style="padding:0.7em;" class="ui-state-error ui-corner-all"> \
		<p> \
  		<strong>Load Google Bookmarks Error!</strong><br /> \
  		<br /> \
      <a href="javascript:void(0)" onclick="gbm_app.load_bookmarks();"><span class="icon ui-icon ui-icon-arrowrefresh-1-e" style="float:left;" />Re-load</a> \
  		&nbsp;<a href="http://www.google.com/bookmarks" target="_blank">not login?</a> \
    </p> \
	</div> \
</div>';
    this.parentDiv.css('border','solid 1px transparent').html(s);
  }
  this.render_status = function(){
    var s = ' \
  <div id="status"> \
  	<a href="#" target="_blank" style="float:left;display:block;text-decoration:none;color:white;cursor:text;">.</a> \
  	<div id="status_bar" class="float-l" style="padding-top:4px;"> &gt; </div> \
  	<div class="float-r button" id="btn_refresh" title="Reload bookmarks" style="margin-right:10px;" onclick="gbm_app.reload();"><img src="images/refresh.png" /></div> \
		<div class="float-r button" id="options_icon" title="Options" onclick="resize_popup();"><img src="../public/options.png" /></div> \
  	<div class="clear"></div> \
  </div>';
  	this.div_footer.html(s);
  	this.div_status_bar = this.div_footer.find('#status_bar');
  }
  this.resize_divs = function(){
    var h = this.config.height - this.div_top.height() - this.div_footer.height(); 
    this.div_main.height(h);
    this.div_main.width(this.config.width);
    this.div_footer.width(this.config.width);
    if (current_tabobj) current_tabobj.resize();
  }
  this.status_cout = 0;
  this.status_text = function(statusText){
    var o = gbm_app;
  	if ( statusText==null){
  		if (o.status_count==3)
  			o.div_status_bar.css("color","black");
  	  else if (o.status_count==2)
  	  	o.div_status_bar.css("color","gray");
  	  else if (o.status_count==1)
  	  	o.div_status_bar.css("color","#aaa");
  	  o.status_count -= 1;
  	  if (o.status_count>0)
  	  	setTimeout("status_text();", 2000);
  	  else
  	  	o.div_status_bar.text(">");
  	}
  	else {
  		o.div_status_bar.text("> " + statusText.substr(0,60)).css("color","red");
      if (statusText!=""){
        o.status_count = 4;
        setTimeout("status_text()",2000);
      }
  	}
  }
  
  this.resize_divs = function(){
    if (this.current_tabobj) this.current_tabobj.resize();
  }      
}

// super-class for tab's operation objects.
function ShowObject(){
  this.title = "";
  this.key   = "";
}
