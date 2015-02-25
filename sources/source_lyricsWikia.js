
function getURLFromLyricWiki(artist, title) 
{
	$
			.ajax({
				url : 'http://lyrics.wikia.com/api.php',
				data : {
					artist : artist,
					song : title,
					fmt : 'xml'
				},
				
				dataType : 'xml',
				type : 'GET',
				cache : false,
				error : function(jqXHR, textStatus, errorThrown) {

					mainView.innerHTML = 'Sorry :( ....An error occurred while retrieving lyrics for "'
							+ title + '" by "' + artist + '" Please retry.';
							
				},
				success : function(lyricsData, status) {
					
					
						// Grab lyrics wikia song url
						var songURL = $(lyricsData).find("url").text();
						var lyrics = $(lyricsData).find("lyrics").text();

						if (lyrics === 'Not found') {
							
							
							getLyricsFromLyricsMasti(title,artist);
							
						}
						getLyricsFromLyricWikiURL(songURL,title,artist);
					

				}

			});
}

function getLyricsFromLyricWikiURL(songURL,title,artist) {
	$
			.ajax({
				url : songURL,
				type : 'GET',
				success : function(songData, songStatus) {
					
					lyrics = getLyricsFromRawHtml_wikia(songData);
					
					if (lyrics.length === 0) {
						getLyricsFromLyricsMasti(title,artist);
					} else {

						spinner('hide');

						document.getElementById('main').innerHTML = lyrics + '</p> Source <a href="'
								+ songURL + '" target="_blank">LyricWiki.  </a>'
								+ 'by-<a href="https://plus.google.com/+ShreyasPonkshe1/" target="_blank">Shreyas Ponkshe :)</a>.';
			
						$('.scrollbar').perfectScrollbar('update');
					}
					
				}
			});
}

function getLyricsFromRawHtml_wikia(data) 
{

	
	
	var filter = function() 
	{return this.nodeType === Node.TEXT_NODE|| $(this).is('p, br, i, b, strong, em');};
	return $('<div>').append(
			$(data).find('.lyricbox').contents().filter(filter)).remove()
			.html();
}