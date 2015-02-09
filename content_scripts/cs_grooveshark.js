
function fetchTrackInfo(){
  Name = '';
  album = '';
  Artist1 = '';
  
  songName = $('a.now-playing-link.song').text().trim();
  firstArtist = $('a.now-playing-link.artist').text().trim();
  ImgSrc=$('#now-playing').find('.img-container img').attr('src');
}