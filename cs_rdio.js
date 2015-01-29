//rdio.com
function fetchTrackInfo(){
  songName = '';
  album = '';
  firstArtist = '';
  
  songName=$(".song_title").text();
  singers=$(".artist_title").text();
  //console.log(songName + '  ' + singers);
  commaIndex = singers.indexOf(",");
 firstArtist = singers.substring(0, commaIndex);
 console.log(firstArtist);
  }