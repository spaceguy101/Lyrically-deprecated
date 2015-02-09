window.onload = function() {
	mainView = document.getElementById('main');
	header = document.getElementById("header");
	artist_name=document.getElementById('artist_name');
     $('.scrollbar').perfectScrollbar();
	 artist = '';
	title = '' ;
	album ='';
	
}

chrome.runtime.sendMessage({'msg':'getTrackInfo'},function(request){

	
	if (request.site == 'others'){
	$(".in").hide(400);
	
	   getLyrics(request.artist, request.title, request.album);
	   $("#imgart").attr("src", request.imgsrc);
	  }
	  
	  
    else if(request.site == 'youtube'){
	$(".in").hide(400);
	
	header.innerHTML = request.title ;
	processYoutubeData(request.title);
	//searchLyricsWikia_google(request.title);
	$("#imgart").attr("src", request.imgsrc);
	}
});

chrome.runtime.onMessage.addListener(function(request, sender,
		sendResponse) {
	if (request.msg == "change") {
	
	if (request.site == 'others'){
	
	$(".in").hide(400);
	mainView.innerHTML = "Searching lyrics...";
	getLyrics(request.artist, request.title, request.album);
	$("#imgart").attr("src", request.imgsrc);
	
	}
	
	 else if(request.site == 'youtube'){
	$(".in").hide(400);
	
	mainView.innerHTML = "Searching lyrics...";
	processYoutubeData(request.title);
	//searchLyricsWikia_google(request.title);
	$("#imgart").attr("src", request.imgsrc);
	}
	
	}
});

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('button').addEventListener('click', input);
});

function input()
{
artist = document.getElementById("artist").value;
title = document.getElementById("title").value;
getLyrics(artist, title);
}
		
		


function setHeader(artist, title)
{
	if (title){
		header.innerHTML = title;
		artist_name.innerHTML=artist;
		$("#artist_name").show(400);
	}
}


function getLyrics(artist, title, album) 
{
	
	
 
	if (!title) {
		mainView.innerHTML = 'No Song title. Cannot search for lyrics :-(';
		return;
	}

	if (!artist) {
		mainView.innerHTML = 'Artist is missing! ';
		getArtistFromMusicBrainz(title, album);
		
		return;
	}
	
	setHeader(artist, title);
	mainView.innerHTML = "Searching....  ";
	getURLFromLyricWiki(artist, title);

}




function processYoutubeData(str){
	
	str = (str).replace(/ (Feat|ft|feat).*?\-/i, '');
			if(/(ft|feat|Feat)/g.test(str))
			{
			str = (str).replace(/ (ft|feat|Feat).*/i, '');
			}
			
			var str_arr=[/official/i,/video/i,/full/i,/song/i,/exclusive/i,/title/i,/audio/i,/latest/i,/unplugged/i,/bollywood/i,/sing/i,/along/i,/\s+(HD|HQ)\s*$/i,/\s*\(\s*[0-9]{4}\s*\)/i];
			for(i=0;i<str_arr.length;i++)
			{
			str = (str).replace(str_arr[i], '');
			}
			
			// Put If else condition whether to Get Lyrics by Youtube method or Other method....
			var patt_title3 = new RegExp(/ \s*\|.*/g);
			var patt_title1 = new RegExp(/\s*\'.*?\'\s*/g);
			var patt_title2 = new RegExp(/\s*\".*?\"\s*/g);
			
			if(patt_title1.test(str)||patt_title2.test(str)||patt_title3.test(str))
			{
			
			//clean title for indian songs
			str = (str).replace(/ \s*\|.*/g, '');
			str = (str).replace(/\s*\|.*?\|\s*/g, ''); // Remove |.*|
			str = str.replace(/^(|.*\s)'(.*)'(\s.*|)$/, '$2'); // capture 'Track title'
			str = str.replace(/^(|.*\s)"(.*)"(\s.*|)$/, '$2'); // capture "Track title"
			str = (str).replace(/\s*\[.*?\]\s*/g, ' ');
			str = (str).replace(/\s*\(.*?\)\s*/g, ' ');
			

			patt_str=new RegExp('-');
			if(patt_str.test(str)){
			
			commaIndex = str.indexOf("-");
			 var title_sony = str.substring(0, commaIndex);
			 var album_sony = str.substring(commaIndex+1, str.length);

			getDataFromMusicBrainz_forYoutube(title_sony,album_sony);
			}
				else getDataFromMusicBrainz_forYoutube(str,'');
				

			}
			
			
			
			//For Non-Indian
			else{
			
			str = (str).replace(/\s*\[.*?\]\s*/g, ' ');
			str = (str).replace(/\s*\(.*?\)\s*/g, ' ');
			
			if(/-/.test(str)&&(str.indexOf('-')!=str.lastIndexOf('-')))
			{
				
		    str=str.replace(/-/,'');		
			commaIndex = str.indexOf("-");
			 title_sony = str.substring(0, commaIndex);
			 album_sony = str.substring(commaIndex+1, str.length);
			getDataFromMusicBrainz_forYoutube(title_sony,album_sony);
		
			}
			else searchGoogle(str);
			
			
			}
	
}


function searchGoogle(title)
{
				$("#artist_name").hide(400);
				title=title.replace(/[:;~*]/g,'');
				header.innerHTML = title ;
				//chrome.runtime.sendMessage({'msg':'change','title':title,'site':'youtube','imgsrc':imgsrc});
				searchLyricsWikia_google(title);
				
			
}


function getDataFromMusicBrainz_forYoutube(title2,album2) {
	title2=title2.trim();
	album2=album2.trim();
	
	if(album2)
	query = 'recording:' + title2 + ' AND release:'+ album2 ;
	else query = 'recording:' + title2 + ' AND country:IN';
	$
			.ajax({
				url : "http://musicbrainz.org/ws/2/recording",
				data : {
					query : query
				},
				type : "GET",
				error : function(jqXHR, textStatus, errorThrown) {
					console.log("Error calling MusicBrainz api!");
					searchGoogle(title2);
				},
				success : function(data, status) {
				
					
					title_arr=$(data).find("title");
						
					artistCredit = $(data).find("artist-credit");
					if (artistCredit.length > 0 && title_arr.length >0) {
						artist= artistCredit[0].getElementsByTagName("artist")[0]
								.getElementsByTagName("name")[0].textContent;
						
						title=title_arr[0].textContent;
						
						console.log("Artist name retrieved from MusicBrainz: "
								+ artist+'title  '+title);
								
					title = (title).replace(/\s*\(.*?\)\s*/g, '');
					//chrome.runtime.sendMessage({'msg':'change','artist':artist ,'title':title,'album':album,'site':'others','imgsrc':imgsrc});		
								
					getLyrics(artist, title, album);
						
					} else {
						console.log("MusicBrainz returned 0 results");
						searchGoogle(title2);
						
					}
				}

			});
}
