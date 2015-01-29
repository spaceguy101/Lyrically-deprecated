window.onload = function() {
	mainView = document.getElementById('main');
	header = document.getElementById("header");
     $('.scrollbar').perfectScrollbar();
	
}

chrome.runtime.sendMessage({'msg':'getTrackInfo'},function(request){

	
	if (request.site == 'others'){
	$("#in").hide(400);
	   getLyrics(request.artist, request.title, request.album);
	  }
	  
	  
    else if(request.site == 'youtube'){
	$("#in").hide(400);
	header.innerHTML = request.title ;
	getLyricsFromLyricWikiURL(request.yt_url);
	}
});

chrome.runtime.onMessage.addListener(function(request, sender,
		sendResponse) {
	if (request.msg == "change") {
	
	if (request.site == 'others'){
	$("#in").hide(400);
	mainView.innerHTML = "Searching lyrics...";
	getLyrics(request.artist, request.title, request.album);
	}
	
	 else if(request.site == 'youtube'){
	$("#in").hide(400);
	mainView.innerHTML = "Searching lyrics...";
	header.innerHTML = request.title ;
	console.log(request.yt_url);
	getLyricsFromLyricWikiURL(request.yt_url);
	}
	
	}
});

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('button').addEventListener('click', input);
});

function input()
{
var artist = document.getElementById("artist").value;
var title = document.getElementById("title").value;
getLyrics(artist, title);
}
		// artist,title is Input from user....
		


function setHeader(artist, title)
{
	if (title){
		header.innerHTML = title + ((artist)?' <em> by </em> ' + artist:"");
	}
}


function getLyrics(artist, title, album) 
{
 
	if (!title) {
		mainView.innerHTML = 'No Song title. Cannot search for lyrics :-(';
		return;
	}

	/* If artist is missing try to get artist name from MusicBrainz */
	if (!artist) {
		mainView.innerHTML = 'Artist is missing! Searching for Artist Name on MusicBrainz...';
		getArtistFromMusicBrainz(title, album);
		
		return;
	}
	
	setHeader(artist, title);
	mainView.innerHTML = "Searching lyrics for " + title + " by " + artist + "...";
	getURLFromLyricWiki(artist, title);

}

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
							mainView.innerHTML = 'Lyrics not found for '
									+ title
									+ ' by '
									+ artist
							getLyricsFromLyricsmint(title,artist);
							throw new Error('LYRICS NOT FOUND');
						}
						getLyricsFromLyricWikiURL(songURL);
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

function getLyricsFromLyricWikiURL(songURL) {
	$
			.ajax({
				url : songURL,
				type : 'GET',
				success : function(songData, songStatus) {
					
					lyrics = getLyricsFromRawHtml_wikia(songData);
					if (lyrics.length === 0) {
						throw ('No lyrics found');
					} else {
						document.getElementById('main').innerHTML = lyrics + '</p> Source <a href="'
								+ songURL + '" target="_blank">LyricWiki.  </a>'
								+ 'by-<a href="https://plus.google.com/+ShreyasPonkshe1/" target="_blank">Shreyas Ponkshe :)</a>.';
						
					}
					
				}
			});
}

function getLyricsFromLyricMintURL(songURL) {
	$
			.ajax({
				url : songURL,
				type : 'GET',
				success : function(songData, songStatus) {
					
					lyrics = getLyricsFromRawHtml_mint(songData);
					if (lyrics.length === 0) {
						throw ('No lyrics found on mint');
					} else {
						document.getElementById('main').innerHTML = lyrics + '</p> Source <a href="'
								+ songURL + '" target="_blank">LyricMint.com  </a>'
								+ 'by-<a href="https://plus.google.com/+ShreyasPonkshe1/" target="_blank">Shreyas Ponkshe :)</a>.';
						
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

function getLyricsFromRawHtml_mint(data) 
{
	var filter = function() 
	{return this.nodeType === Node.TEXT_NODE|| $(this).is('p, br, i, b, strong, em');};
	return $('<div>').append(
			$(data).find('#lyric').contents().filter(filter)).remove()
			.html().trim().replace(/ Also Listen to.*/, '');;
}


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
					console.log("Error calling MusicBrainz api!");
					mainView.innerHTML = 'Error occurred on MusicBrainz ';
							
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

/*
*Need to improve Search Results!
 */
function getLyricsFromLyricsmint(title,artist) {

$.ajax({
			url: 'https://ajax.googleapis.com/ajax/services/search/web',
			data: {v:'1.0',q: 'site:www.lyricsmint.com -"Page Ranking Information"' + title },
			dataType: 'jsonp',
			type: 'GET',
			error: function(){},
			success: function(googledata){
			
				url_lyricsmint = googledata.responseData.results[0].unescapedUrl ;
				document.getElementById('main').innerHTML = '</p> Try URL <a href="'
								+ url_lyricsmint + '" target="_blank">'
									+ title
									+ '" by "'
									+ artist +'</a>';
									
				getLyricsFromLyricMintURL(url_lyricsmint)	;				
				
			}});
}