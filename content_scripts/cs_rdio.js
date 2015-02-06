//rdio.com
function fetchTrackInfo(){
  Name = '';
  album = '';
  Artist1 = '';
  
  if($(".song_title").text()){
  Name=$(".song_title").text();
  singers=$(".artist_title").text();
  console.log(Name + '  ' + singers);
  commaIndex = singers.indexOf(",");
 Artist1 = singers.substring(0, commaIndex);
  }
  else return;
   }