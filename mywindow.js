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
	//console.log(request.yt_url);
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




