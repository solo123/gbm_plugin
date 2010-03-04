ToolsObject.prototype = new ShowObject;
ToolsObject.prototype.constructor = ToolsObject;
function ToolsObject(){
  this.title    = "Tools";
  this.key      = "tools";

  this.render = function(div){
    this.parentDiv = div;
    div.html("");
    var s = ' \
<div id="tools"> \
 <ul> \
   <li> \
       <img  src="images/myAccountIcon.jpg" height="24" alt="account" />\
       <a href="https://www.google.com/accounts/ManageAccount?service=hist" target="_blank">My account</a> | <a href="https://www.google.com/accounts/Logout?continue=http://www.google.com" target="_blank" >Logout</a></li> \
   <li><a href="javascript:void(0)" onclick="resize_popup();"  target="_blank"> \
       <img style="border:solid 1px #999;" src="images/resize.png" height="24" alt="resize" />\
       Resize popup window.</a></li> \
   <li><a href="../tools/import.html"  target="_blank"> \
       <img src="images/import.png" height="24" alt="import" />\
       Export Chrome\'s bookmarks into Google Bookmarks.</a></li> \
   <li><a href="../options/options.html"  target="_blank"> \
       <img src="../public/options.png" height="24" alt="options" />\
       Option page.</a></li> \
   <li><a href="test.html"  target="_blank"> \
       <img src="images/blue_t.gif" height="24" alt="test" />\
       Test page.</a></li> \
 </ul> \
</div>';
    
    div.append($('<div>').css('padding','16px 8px').html(s));
  }
  
  this.resize = function(){}
  this.refresh = function(){}
}
