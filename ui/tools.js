function load_option(option){
  var op = localStorage[option];
  if (op && op.length>0) 
    return op;
  else 
    return default_option(option);
}
function default_option(option){
  if (option=="width") return "400";
  else if (option=="height") return "400";
  else if (option=="font_size") return "0.9em";
  else return "";
}
function GetStateInt(state){
  if (typeof(gbm_app.bkg.States[state])=="undefined")
    return -1;
  else
    return gbm_app.bkg.States[state];
}
function GetState(state){
  if (typeof(gbm_app.bkg.States[state])=="undefined")
    return "";
  else
    return gbm_app.bkg.States[state];
}

function string_in_array(str,arr){
  for(var i in arr){
    if (str==arr[i]) return true;
  }
  return false;
}
function all_in_array(srcArr, tagArr){
  for(var i in srcArr){
    if (!string_in_array(srcArr[i],tagArr))
      return false;
  }
  return true;
}
function have_one_in_array(srcArr, tagArr){
  for(var i in srcArr){
    if (string_in_array(srcArr[i],tagArr)) return true;
  }
  return false;
}

function status_text(txt){
  gbm_app.status_text(txt);
}

function bookmark_tips(bookmark){
		var tips = bookmark.title + 
			'\n----------------------------------------------------------------\n' +
			'Url   : ' + bookmark.href.toString().substr(0,55)   + "\n" + 
			'Labels: ' + bookmark.labels.join(",").substr(0,50) + "\n" +
			'Create: ' + timestamp_tostring(bookmark.timestamp) + "\n";
   return tips;
}
function timestamp_tostring(timestamp){
  if (!timestamp) return "";
	return '' + timestamp.getFullYear() +"."
			+ timestamp.getMonth() + "."
			+ timestamp.getDay() + " " 
      + timestamp.toTimeString() + "\n";
}

function resize_popup(){
  var op = new BMOptions();
  op.render($('#container'));
}