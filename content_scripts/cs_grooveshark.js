
function fetchTrackInfo(){
  Name = '';
  album = '';
  Artist1 = '';
  
  Name = $('a.now-playing-link.song').text().trim();
  Artist1 = $('a.now-playing-link.artist').text().trim();
  ImgSrc=$('#now-playing').find('.img-container img').attr('src');
  
}