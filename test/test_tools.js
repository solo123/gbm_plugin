// JavaScript Document

function obj2string(obj){
  var out = [];
  if (obj==null) 
    out.push("null");
  else {
    for(var i in obj){
      out.push("obj[");
      out.push(i);
      out.push("] = ");
      out.push(obj[i]);
      out.push("<br />");    
    }
  }
  return "<p>" + out.join("") + "</p><hr />";
}
