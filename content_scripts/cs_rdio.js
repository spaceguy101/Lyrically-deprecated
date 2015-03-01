Name = '';
album = '';
Artist1 = '';
ImgSrc = '';




setInterval(function() {	


var prevName=Name;	



Name = album = Artist1 = ImgSrc = '';

	sudoName=$(".song_title").text();
	singers=$(".artist_title").text();
	commaIndex = singers.indexOf(",");
	sudoArtist1 = (commaIndex === -1)?singers:singers.substring(0, commaIndex);
console.log(sudoName);
		if (sudoName && sudoArtist1 ) {
			
			Name = sudoName;
  			Artist1 = sudoArtist1;
			ImgSrc=$('.queue_art').attr('src');
			//clearInterval(refreshInterval);
console.log(Name);
				if (Name !== prevName && Name) {
					chrome.runtime.sendMessage( {'msg' : 'trackInfo','artist' : Artist1,'title' : Name,'album' : album,'imgsrc':ImgSrc});
				}
				

		} 
		
	}, 1500);




// Use thsi to skip on ads /  $('.App_PlayerFooter_Ad').children().length > 0