//rdio.com
function fetchTrackInfo(){
  Name = '';
  sudoname='';
  album = '';
  sudoartist='';
  Artist1 = '';
 
}
function set(){
 if(sudoname !== '')
 {
 Name=sudoname;
 Artist1=sudoartist;
 console.log('fetch');
 }
 else get();
}

   function get(){
  sudoname=$(".song_title").text();
  singers=$(".artist_title").text();
  console.log('get');
  commaIndex = singers.indexOf(",");
 sudoartist = (commaIndex === -1)?singers:singers.substring(0, commaIndex);
 set();
 }