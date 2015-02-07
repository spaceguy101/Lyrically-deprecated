
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
					mainView.innerHTML = 'An error occurred while retrieving lyrics for "'
							+ title + '" by "' + artist + '". Please retry.';
				},
				success : function(lyricsData, status) {
					try {
						// Grab lyrics wikia song url
						var songURL = $(lyricsData).find("url").text();

						if (!songURL) {
							throw ('Could not find a song URL');
						}

						var lyrics = $(lyricsData).find("lyrics").text();
						if (lyrics === 'Not found') {
							
							//getLyricsFromLyricsmint(title,artist);
							getLyricsFromLyricsMasti(title,artist);
							throw new Error('LYRICS NOT FOUND');
						}
						getLyricsFromLyricWikiURL(songURL,title,artist);
					} catch (err) {
						if (err.message != 'LYRICS NOT FOUND') {
							document.getElementById('main').innerHTML = 'An error occurred while retrieving lyrics for "'
									+ title
									+ '" by "'
									+ artist
									+ '". Please retry.';
						}
					}

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