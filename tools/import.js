var bm_path;
var bm_xml;

$(function() {
  $('#container').tabs();
  dumpBookmarks();
});
function dumpBookmarks() {
  $('#bookmarks').html("");
  $('#data').val("");
  var nodes = chrome.bookmarks.getTree(
    function(nodes) {
      bm_path = [];
      bm_xml  = [];
      $('#bookmarks').append(dumpNodes(nodes[0].children[0].children));
      $("#bookmarks > ul").addClass('filetree').treeview();
      $('#data').val('"1.0" encoding="utf-8"?><bookmarks>' + bm_xml.join("\n") + '</bookmarks>');
    });
}
function dumpNodes(nodes){
  if (!nodes) return null;
  var ul = $('<ul>');
  for (var i=0; i<nodes.length; i++){
    ul.append(dumpNode(nodes[i]));
  }
  return ul;
}
function dumpNode(node){
  var li = $('<li>');
  var span = $('<span>');
  if (node.children){
    span.append(node.title).addClass('folder');
  } else {
    span.append(node.title).addClass('file');
    bm_xml.push("<bookmark><title>" + node.title + "</title><url>"+ node.url +"</url><labels>");
    for (var i=0; i<bm_path.length; i++)
      bm_xml.push("<label>"+ bm_path[i] +"</label>");
    bm_xml.push("</labels></bookmark>");    
  }
  li.append(span);
  li.addClass('closed');
  if (node.children && node.children.length>0){
    bm_path.push(node.title);
    li.append(dumpNodes(node.children));
    bm_path.pop();
  }
  return li;
}