/***********************************************************************
*  Google Chrome Bookmarks Extension
*-------------------------------------------------------------------------------------
*  Create by: Jimmy Liang, 2009.12.24, Xmas eve just for fun
*  OpenSource: http://github.com/solo123/gbm_plugin.git
*
************************************************************************/
var bkg = chrome.extension.getBackgroundPage();  // ref to background.html
var bookmarks = bkg.bookmarks;
var status_count = 0;  // for the status text

// ------------------- init & reload -------------------------
function Init()
{
  if (!bookmarks.load_ready) 
    ReloadBookmarks();
  else {
  	$("#refresh_icon").html("<img src='images/refresh.png' />").click(ReloadBookmarks);
    $("#tabs")
      .tabs("select", GetState("current_tab"))
      .bind('tabsselect', function(event,ui){bkg.States.previous_tab = bkg.States.current_tab;bkg.States.current_tab = ui.index; });
      //.bind('tabsselect', function(event,ui){TabClicked(event, ui);});
    add_labels_auto();
  }
}
var add_labels_auto_flag = false;
function add_labels_auto(){
  add_labels_auto_flag = true;
      // auto-complete
    $("#bm_labels").autocomplete(bookmarks.all_labels, 
      {
        multiple: true,
    		minChars: 0,
    		autoFill: true,    
        formatItem: function(row, i, max) {return row.label;},
    		formatMatch: function(row, i, max){return row.label;}    
      });
}
function ReloadBookmarks(){
	$("#refresh_icon").html("<img src='images/indicator.gif' />"); //.unbind('click');
	bookmarks.LoadBookmarkFromUrl(AfterBookmarkLoaded);
}
function AfterBookmarkLoaded(){
	if (!bookmarks.load_ready || bookmarks.load_error) 
    status_text("Load bookmarks error, need login?");
  else {
    var current_tab = $("#tabs").tabs('option', 'selected');
    $("#tabs").unbind('tabsselect')
      .bind('tabsselect', function(event,ui){bkg.States.previous_tab = bkg.States.current_tab;bkg.States.current_tab = ui.index; });
    AfterTabShow(current_tab);
    if (!add_labels_auto_flag) add_labels_auto();
	  status_text("Bookmarks loaded.");
	}
	$("#refresh_icon").html("<img src='images/refresh.png' />").click(ReloadBookmarks);
  $("#tabs").data('disabled.tabs', '');
}
function GetStateInt(state){
  if (typeof(bkg.States[state])=="undefined")
    return -1;
  else
    return bkg.States[state];
}
function GetState(state){
  if (typeof(bkg.States[state])=="undefined")
    return "";
  else
    return bkg.States[state];
}

//----------------- Tab events ---------------------------------------
function LoadReady(){
  return (bookmarks && bookmarks.load_ready);
}
function AfterTabShow(tab){
  if (!LoadReady()) return;
  
	if (tab!=3) $("#label_add").text("Add");
	if (tab==0){
	  bm_load();
  } else if (tab==1){
    sh_load();
  } else if (tab==2){
    lb_load();
  } else if (tab==3){
    if ($("#label_add").text()=="Add"){
  	  // get add url from chrome's tab
  	  chrome.tabs.getSelected(null, function(ctab){
  	    var l = GetStateInt("current_label_id");
  	    var bm = {
  	       id   : '',
  	       href : ctab.url,
           title : ctab.title,
           labels : l>0 ? [bookmarks.all_labels[l].label] : [],
           timestamp : new Date()  
        };
        ShowBmTable(bm,"Add");
  		});
    }
  }
}
function save_add_bookmark(){
  $.ajax({
		type: "post",
		url: bkg.GOOGLE_BOOKMARK_BASE + "mark",
		data: {
      bkmk : $('#bm_url').val(), 
      prev : '', 
      title : $('#bm_title').val(), 
      labels : $('#bm_labels').val(), 
      sig : bookmarks.sig},
		success: function(data, textStatus){
		  status_text("Bookmark Saved:" + data.toString().substr(0,40));
		  //$("#tabs").tabs('select',bkg.States.previous_tab);
		  bookmarks.LoadBookmarkFromUrl(AfterBookmarkLoaded);
		},
		error: function(){
		  status_text('Bookmark save error!');
		}
	});
}
function ShowBmTable(bm, operation){
  $("#label_add").text(operation);
  if (operation=="Add"){
    bm1 = bookmarks.GetBookmarkByUrl(bm.href);
    if (bm1){
      bm.labels = bm1.labels;
      bm.timestamp = bm1.timestamp;
      ShowBmTable(bm,"Edit");
      return;
    }
    $("#bm_op_title").text("Add Bookmark").css('color','green');
    $("#btn_op").val("Add Bookmark").unbind('click').click(save_add_bookmark);
  } else if (operation=="Edit"){
    $("#bm_op_title").text("Edit Bookmark").css('color','darkblue');
    $("#btn_op").val("Save").unbind('click').click(save_add_bookmark);
  } else if (operation=="Delete"){
    $("#bm_op_title").text("Delete Bookmark").css('color','red');
    $("#btn_op").val("Confirm Delete").unbind('click').click(dele_bookmark);
  }
  $("#bm_url").val(bm.href);
  $("#bm_title").val(bm.title);
  $("#bm_id").text(bm.bm_id);
  $("#bm_labels").val(bm.labels ? bm.labels.join(", ") : "");
  $("#bm_time").text(bm.timestamp.getFullYear() +"."
			+ bm.timestamp.getMonth() + "."
			+ bm.timestamp.getDay() + " " + bm.timestamp.toTimeString() );
}
function OpenEditTab(bookmark){
	ShowBmTable(bookmark,"Edit");
	$("#tabs").tabs('select', 3);
}

function status_text(statusText){
	if ( statusText==null){
		if (status_count==3)
			$("#status_bar").css("color","black");
	  else if (status_count==2)
	  	$("#status_bar").css("color","gray");
	  else if (status_count==1)
	  	$("#status_bar").css("color","#aaa");
	  status_count -= 1;
	  if (status_count>0)
	  	setTimeout("status_text();", 2000);
	  else
	  	$("#status_bar").text(">");
	}
	else {
		$("#status_bar").text("> " + statusText).css("color","red");
    if (statusText!=""){
      status_count = 4;
      setTimeout("status_text()",2000);
    }
	}
}

function BookmarkTips(bookmark){
		var tips = bookmark.title + 
			'\n----------------------------------------------------------------\n' +
			'Url:       ' + bookmark.href   + "\n" + 
			'Labels:  ' + bookmark.labels + "\n" +
			'Create: ' + bookmark.timestamp.getFullYear() +"."
			+ bookmark.timestamp.getMonth() + "."
			+ bookmark.timestamp.getDay() + " " 
      + bookmark.timestamp.toTimeString() + "\n";
   return tips;
}

function set_options(){
  $('body').css('height','auto').css('width','auto');
  $('#container').hide();
  var r = $('#resizer');
  r.show();
  r.resizable({
      minWidth:  340,
      minHeight: 400,
      stop: function(a,b){
        localStorage["width"] = b.size.width;
        localStorage["height"] = b.size.height;
        $('#width').val(b.size.width);
        $('#height').val(b.size.height);
      }
   });
  if (localStorage["height"]) r.height(localStorage["height"]);
  if (localStorage["width"]) r.width(localStorage["width"]);
  load_options();
}
function restore_options(){
  $('#font_size').val('0.9em');
  $('#height').val('580');
  $('#width').val('600');
}
function save_options() {
  $(".options").each(function(){
    var op = this.id;
    localStorage[op] = $(this).val();
  });
}

function load_options() {
  $(".options").each(function(){
    var op = this.id;
    var v  = localStorage[op];
    $(this).val(v ? v : "");
  });
}
//------------------- startup ------------------------------
function LoadOption(option){
  var op = localStorage[option];
  if (op && op.length>0) 
    return op;
  else 
    return default_option(option);
}
function default_option(option){
  if (option=="width") return "610";
  else if (option=="height") return "620";
  else if (option=="font_size") return "0.9em";
  
}

var pop_w;
var pop_h;
$(function(){
  pop_w = parseInt(LoadOption("width"));
  pop_h = parseInt(LoadOption("height"));
  var s = 36;
  $("body")
  	.css("font-size", LoadOption("font_size"))
    .height(pop_h).width(pop_w);

  $("#tabs").tabs({show: function(event,ui){AfterTabShow(ui.index)}});

  var th= $('#tabs .ui-tabs-nav').height();
  $(".tab").height(pop_h-s-th-19);
  $('#container').height(pop_h-2);
  $("#div_main").height(pop_h-s-th);
  $("#div_add").height(pop_h-s-th-10);
  $("#bm_all").height(pop_h-s-th-38);
  $("#div_multi_labels").height(pop_h-s-th-36);

  $("#accordion").accordion({fillSpace: true});
  $("#label_add").text("Add");
  
  Init();
});
