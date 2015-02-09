//rdio.com
function fetchTrackInfo(){
  Name = '';
  album = '';
  Artist1 = '';
  
 
  Name=$(".song_title").text();
  singers=$(".artist_title").text();
  console.log(Name + '  ' + singers);
  commaIndex = singers.indexOf(",");
 Artist1 = singers.substring(0, commaIndex);
}
  