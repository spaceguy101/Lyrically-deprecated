function fetchTrackInfo(){
  Name = '';
  Artist1 = '';
  ImgSrc='';

  Name = $(".title a")[0].innerText;
  Artist1 = $(".artist a").text();
  ImgSrc=$('.current-song-art').attr('style').replace('background-image: url(','').replace(')','').replace(/;/,'').replace(/1200/g,'200');
}