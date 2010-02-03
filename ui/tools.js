
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