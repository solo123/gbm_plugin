function ApplicationTabs(){
  this.edit_tab = -1;
  this.div_main = null;
  
  this.render_tabs = function(div, tablist){
    div.html("");
    if (!div || !tablist || tablist.length<1) return;
    
    this.tabs = $('<div>');
    var ul = $('<ul>');
    for (var i=0; i<tablist.length; i++){
      this.tabs.append($("<div>").attr("id","tab_" + i).addClass('tab'));
      var lnk = $('<a>').attr('href','#tab_'+i);
      if (tablist[i].indexOf("Add")>=0){
        lnk.html('<img src="images/sprite.png" height="12" /> <span id="label_add">Add</span></a>');
        this.edit_tab = i;
      }
      else 
        lnk.text(tablist[i]);
      ul.append($('<li>').append(lnk));
    }
    this.tabs.prepend(ul);
    div.append(this.tabs);
    this.tabs.tabs({
      selected: load_option("current_tab"), 
      show: function(event,ui){
        gbm_app.app_tabs.after_tab_show(ui)
      }
    });
    this.tabs.css("border","0").css('font-size','12px');
    if (this.div_main) this.div_main.css('margin-top','-26px');
  }
  this.resize = function(){
  }
  this.after_tab_show = function(ui){
    var tabname = $(ui.tab).text().toLowerCase().replace(/(^\s*)|(\s*$)/g, ""); //trim
    if (ui.index!=gbm_app.app_tabs.edit_tab) $('#label_add').text("Add");
    localStorage["current_tab"] = ui.index;
    if (this.on_tab_show) this.on_tab_show(tabname);
  }
  this.show_edit_tab = function(tabTitle){
    $('#label_add').text(tabTitle);
    this.tabs.tabs('select', this.edit_tab);
  }
}


