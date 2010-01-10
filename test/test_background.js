// JavaScript Document

function test_background(){
  document.write("<h2> test load bookmarks </h2>");
  LoadBookmarkFromUrl(test_after_loaded);
  document.write(obj2string(MyBookmarks));
}

function test_after_loaded(){
  document.write("<h3> bookmark loaded </h3>");
  document.write(obj2string(MyBookmarks));
  
  var bmid = MyBookmarks.all_bookmarks[10].bm_id;
  document.write("Find: " + bmid + "<br />");
  document.write(obj2string(FindBookmarkById(bmid)));
}
