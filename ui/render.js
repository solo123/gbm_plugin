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
	<div id="status_bar" class="float-l"> &gt; </div> \
	<div class="float-r button" id="btn_refresh" title="Reload bookmarks"><img src="images/refresh.png" /></div> \
	<div class="float-r button" title="Options" onclick="set_options();"><img src="../public/options.png" /></div> \
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
    tabs.append($("<div>").attr("id","tab_" + i));
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
  if (tabname == "bookmarks"){
    render_bookmarks(div_main, -1);    
  }
}

function render_bookmarks(div, current_label){
  if (!bookmarks.load_ready) return render_loading();
  
  var lbs = $('<div class="bm-labels">');
  var bmz = $('<div class="bm-bookmarks">');
  var bms = $('<div class="bm-table">');
  
  div.html("");
  render_labels(lbs, current_label);
  render_label_bookmarks(bms,current_label);
    
  lbs.css('padding','4px');
  lbs.click(label_onclick);
  bmz.addClass('ui-widget-content').css('padding','4px');
  bmz.append(bms);
  div.append(lbs).append(bmz);
}
function label_onclick(){
  var tag = event.srcElement;
  event.returnvalue = false;
  if (tag.className == "f"){
    $(".bm-labels .selected").removeClass("selected");
  //var options = { to: "#div_bookmarks", className: 'ui-effects-transfer' }; 
  //lnk.effect("transfer",options,500);
     var bid = $(tag).addClass('selected').attr('tag');
     var div = div_main.find('.bm-table');
     render_label_bookmarks(div,bid);
     div.find('.bm a').width(div_main.width()-76);
  }

 viewportheight = document.documentElement.clientHeight
 status_text("viewportheight:"+ viewportheight +", top:" + div_top.height() + ", main:"+div_main.height() + ", footer:"+div_footer.height()+", config:"+config.height );
}
function render_labels(div, selected_label){
  if (!bookmarks.load_ready) return;
  for (var i=0; i<bookmarks.all_labels.length; i++){
    var lb = $('<div>');
    lb.addClass('f').text(bookmarks.all_labels[i].label);
    lb.attr('tag', i);
    if (selected_label>0 && i==selected_label) lb.addClass('selected');
    div.append(lb);
  }
  div.append($('<div>').addClass('clear'));
}
function render_label_bookmarks(div, label){
  div.html("");
  if (!bookmarks.load_ready || label<0) return;
  var lb = bookmarks.all_labels[label];
  if (!lb || lb.bookmarks.length<1) return;
	for (var i=0; i<lb.bookmarks.length; i++){
		var bm = lb.bookmarks[i];
		var row = $('<div>').addClass('row');
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

var search_id = 0;
function render_search_result(div, search_text, sid){
  var cnt = 0;
  if (sid != search_id) return cnt;
  var ss = search_text;
  //bkg.States.current_search = ss; 
  console.log("search:" + ss);
	var reg = new RegExp(ss, "i");
	for (var i=0; i<bookmarks.all_bookmarks.length; i++){
    if (sid != search_id) {console.log("search break:" + sid); return cnt;}
	   
		var bm = bookmarks.all_bookmarks[i];
		if (reg==null || reg.test(bm.title) || reg.test(bm.href) || reg.test(bm.labels.join(","))){
		  var row = $('<div>');
		  var col1 = $('<div>')
		    .append($("<span class='icon ui-icon ui-icon-pencil ui-corner-all' title='Edit' onclick='sh_edit("+ i +")' />"))
		    .append($("<span class='icon ui-icon ui-icon-trash ui-corner-all'  title='Delete' onclick='sh_dele("+ i +")' />"));
		  var col2 = $('<div>');
		  var ancr = $('<a>')
		    .attr('href',bm.href)
        .attr('target', '_blank')
        .text(bm.title)
        .attr('title', bookmark_tips(bm));
      col2.append(ancr);
      var col3 = $('<div>')
        .text(bm.labels.join(", "));
      var col4 = $('<div>').text(bm.href);
      row.append(col1).append(col2).append(col3).append(col4);
      div.append(row);
      cnt++;
		}
	}
	return cnt;
}