function fetchTrackInfo(){
	
  Name = '';
  album = '';
  Artist1 = '';
  ImgSrc='';
  Name = $(".player_track_title").text();
  Artist1 = $(".album_title:first").children(":last").text();
  ImgSrc=$(".player_cd_bg img").attr('src');
}