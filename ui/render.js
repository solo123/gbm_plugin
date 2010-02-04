function render_loading(div){
  if(!div) return;
    var s = '\
<div class="ui-widget" style="width:280px;margin:auto;font-size:14px;padding:4px;">\
	<div style="padding:0.7em;" class="ui-state-highlight ui-corner-all"> \
		<p> \
  		<img src="images/indicator.gif" /> \
  		<strong>&nbsp;Loading Google Bookmarks...</strong><br /> \
  		<br /> \
  		&nbsp;<a href="http://www.google.com/bookmarks" target="_blank">not login?</a> \
    </p> \
	</div> \
</div>';
    div.css('border','solid 1px transparent').html(s);
}
function render_error(div){
  if(!div) return;
    var s = '\
<div class="ui-widget" style="width:280px;margin:auto;font-size:14px;padding:4px;">\
	<div style="padding:0.7em;" class="ui-state-error ui-corner-all"> \
		<p> \
  		<strong>Load Google Bookmarks Error!</strong><br /> \
  		<br /> \
      <a href="javascript:void(0)" onclick="reload_bookmarks();"><span class="icon ui-icon ui-icon-arrowrefresh-1-e" style="float:left;" />Re-load</a> \
  		&nbsp;<a href="http://www.google.com/bookmarks" target="_blank">not login?</a> \
    </p> \
	</div> \
</div>';
    div.css('border','solid 1px transparent').html(s);
}
function render_status(){
  var s = ' \
<div id="status"> \
	<a href="#" target="_blank" style="float:left;display:block;text-decoration:none;color:white;cursor:text;">.</a> \
	<div id="status_bar" class="float-l" style="padding-top:4px;"> &gt; </div> \
	<div class="float-r button" id="btn_refresh" title="Reload bookmarks" style="margin-right:10px;"><img src="images/refresh.png" /></div> \
	<div class="float-r button" title="Options" onclick="set_options();" ><img src="../public/options.png" /></div> \
	<div class="clear"></div> \
</div>';
	div_footer.html(s);
}

function render_tabs(div, tablist){
  div.html("");
  if (!div || !tablist || tablist.length<1) return;
  
  var tabs = $('<div>');
  var ul = $('<ul>');
  for (var i=0; i<tablist.length; i++){
    tabs.append($("<div>").attr("id","tab_" + i).addClass('tab'));
    ul.append($('<li>').append($('<a>').attr('href','#tab_'+i).text(tablist[i])));
  }
  tabs.prepend(ul);
  div.append(tabs);
  tabs.tabs({
    show: function(event,ui){after_tab_show(ui)}
  });
  tabs.css("border","0").css('font-size','12px');
  div_main.css('margin-top','-26px');
  
}
function after_tab_show(ui){
  var tabname = $(ui.tab).text().toLowerCase();
  
  for(var i=0; i<tabsobj.length; i++){
    if (tabname == tabsobj[i].key){
      current_tabobj = tabsobj[i];
      current_tabobj.render(div_main);
      current_tabobj.resize();
      break;
    }
  }
}


function bookmark_tips(bookmark){
		var tips = bookmark.title + 
			'\n----------------------------------------------------------------\n' +
			'Url:       ' + bookmark.href   + "\n" + 
			'Labels:  ' + bookmark.labels + "\n" +
			'Create: ' + timestamp_tostring(bookmark.timestamp) + "\n";
   return tips;
}
function timestamp_tostring(timestamp){
  if (!timestamp) return "";
	return 'Create: ' + timestamp.getFullYear() +"."
			+ timestamp.getMonth() + "."
			+ timestamp.getDay() + " " 
      + timestamp.toTimeString() + "\n";
}

