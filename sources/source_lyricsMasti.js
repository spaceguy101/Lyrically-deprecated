
//For Lyrics masti.com
function getLyricsFromLyricsMasti(title,artist) {

$.ajax({
			url: 'https://ajax.googleapis.com/ajax/services/search/web',
			data: {v:'1.0',q: 'site:www.lyricsmasti.com -"Page Ranking Information"' + title },
			dataType: 'jsonp',
			type: 'GET',
			error: function(){},
			success: function(googledata){
				if(googledata.responseData.results[0].unescapedUrl){
				url_lyricsMasti = googledata.responseData.results[0].unescapedUrl ;
				
				document.getElementById('main').innerHTML = '</p> Try URL <a href="'
								+ url_lyricsMasti + '" target="_blank">'
									+ title
									+ '" by "'
									+ artist +'</a>';
									
				getLyricsFromLyricMastiURL(url_lyricsMasti)	;	
				}
				else{
					document.getElementById('main').innerHTML='Cant find on mint';
				}
							
				
			}});
}


function getLyricsFromLyricMastiURL(songURL) {
	$
			.ajax({
				url : songURL,
				type : 'GET',
				success : function(songData, songStatus) {
					
					lyrics = getLyricsFromRawHtml_masti(songData);
					
					if (lyrics.length === 0) {
						throw ('No lyrics found on mint');
					} else {
						document.getElementById('main').innerHTML = lyrics + '</p> Source <a href="'
								+ songURL + '" target="_blank">LyricMasti.com  </a>'
								+ 'by-<a href="https://plus.google.com/+ShreyasPonkshe1/" target="_blank">Shreyas Ponkshe :)</a>.';
						$('.scrollbar').perfectScrollbar('update');
					}
					
					
				}
			});
}



function getLyricsFromRawHtml_masti(data) 
{
	var filter = function() 
	{return this.nodeType === Node.TEXT_NODE|| $(this).is(' br, i, b, strong, em');};
	return $('<div>').append(
			$(data).find('#lcontent1').contents().filter(filter)).remove()
			.html();
}