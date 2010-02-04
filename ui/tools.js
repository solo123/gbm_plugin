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

var status_cout = 0;
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
