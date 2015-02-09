function fetchTrackInfo(){
  Name = '';
  Artist1 = '';
  ImgSrc ='';
  
Name= $('#player').find('.track-title a').text();
singers=$('#player').find('.artist-name a')[0].innerText;
commaIndex = singers.indexOf(",");
 Artist1 = (commaIndex === -1)?singers:singers.substring(0, commaIndex);
ImgSrc=$('.album-thumb').attr('src');
}