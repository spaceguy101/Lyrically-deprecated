//rdio.com
function fetchTrackInfo(){
 
 
 	
get();


}

function get(){  
var refreshInterval = setTimeout(function() {		

	sudoName=$(".song_title").text();
	singers=$(".artist_title").text();
	commaIndex = singers.indexOf(",");
	sudoArtist1 = (commaIndex === -1)?singers:singers.substring(0, commaIndex);

		if (sudoName && sudoArtist1 ) {
			
			Name = sudoName;
  			Artist1 = sudoArtist1;
			ImgSrc=$('.queue_art').attr('src');
			//clearInterval(refreshInterval);

		} else {
			get();
		}
	}, 500);


}

// Use thsi to skip on ads /  $('.App_PlayerFooter_Ad').children().length > 0