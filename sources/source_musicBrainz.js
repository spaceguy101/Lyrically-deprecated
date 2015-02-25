function getArtistFromMusicBrainz(title, album) {
	var artist = 'Not Found';
	query = 'recording:"' + title + '" AND release:"' + album + '"';

	$
			.ajax({
				url : "http://musicbrainz.org/ws/2/recording",
				data : {
					query : query
				},
				type : "GET",
				error : function(jqXHR, textStatus, errorThrown) {
					
					spinner('hide');
					mainView.innerHTML = 'Error occurred.... ';
							
				},
				success : function(data, status) {
					artistCredit = $(data).find("artist-credit");
					if (artistCredit.length > 0) {
						artist = artistCredit[0].getElementsByTagName("artist")[0]
								.getElementsByTagName("name")[0].textContent;
						getLyrics(artist, title, album);
					} else {
						getLyrics('Not Found', title, album);
					}
				}

			});
}