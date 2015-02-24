
window.onload = function() {
	mainView = document.getElementById('main');
	header = document.getElementById("header");
	artist_name=document.getElementById('artist_name');
     $('.scrollbar').perfectScrollbar();
	 artist = '';
	title = '' ;
	album ='';
	


}



document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('svg').addEventListener('click', openPopup);
});



function openPopup() {
   $('#test').toggle( 400,"swing");
}

function closePopup() {
   
    $('#test').hide(400,"swing");
}



document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('bttn').addEventListener('click', input);
});

function input()
{

	


$("#imgart").attr("src", 'images/icon64.png');

document.getElementById("header-wrap").style.backgroundColor =
document.body.style.borderColor ='#4285f4';

artist = document.getElementById("artist").value;
title = document.getElementById("title").value;
getLyrics(artist, title);
}
	



chrome.runtime.sendMessage({'msg':'getTrackInfo'},function(request){

	
	if (request.site == 'others'){
	
	
	   getLyrics(request.artist, request.title, request.album);
	 
	  }
	  
	  
    else if(request.site == 'youtube'){
	
	
	header.innerHTML = '' ;
	processYoutubeData(request.title);
	//searchLyricsWikia_google(request.title);

	}

	  $("#imgart").attr("src", request.imgsrc);
	  changeToDominantColor(request.imgsrc);

	
});

chrome.runtime.onMessage.addListener(function(request, sender,
		sendResponse) {
	if (request.msg == "change") {
	
	if (request.site == 'others'){
	
	
	//mainView.innerHTML = "Searching lyrics...";
	spinner('show');
	getLyrics(request.artist, request.title, request.album);
	
	
	}
	
	 else if(request.site == 'youtube'){
	
	
	//mainView.innerHTML = "Searching lyrics...";
	spinner('show');
	processYoutubeData(request.title);
	//searchLyricsWikia_google(request.title);
	}
	
	$("#imgart").attr("src", request.imgsrc);
	changeToDominantColor(request.imgsrc);

	}
});



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
	
	closePopup();
 
	if (!title) {
		spinner('hide');
		mainView.innerHTML = 'No Song title. Cannot search for lyrics :-(';
		return;
	}

	if (!artist) {
		mainView.innerHTML = 'Artist is missing! ';
		getArtistFromMusicBrainz(title, album);
		
		return;
	}
	
	setHeader(artist, title);
	//mainView.innerHTML = "Searching....  ";
	getURLFromLyricWiki(artist, title);
	

}




function processYoutubeData(str){

	closePopup();
	
	str = (str).replace(/ (Feat|ft|feat|Ft).*?\-/i, '');
			if(/(ft|feat|Feat|Ft)/gi.test(str))
			{
			str = (str).replace(/ (ft|feat|Feat|Ft).*/i, '');
			}
			
			var str_arr=[/official/i,/video/i,/full/i,/song/i,/exclusive/i,/title/i,/audio/i,/latest/i,/unplugged/i,/bollywood/i,/sing/i,/along/i,/\s+(HD|HQ)\s*$/i,/\s*\(\s*[0-9]{4}\s*\)/i,/remix/i];
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
				$("#artist_name").css("display", "none");
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


function changeToDominantColor(srcImg){


if(srcImg)
{
	var img = new Image();

img.src =srcImg;




var canvas=document.createElement("canvas");

canvas.height=img.height;
canvas.width=img.width;


var ctx=canvas.getContext("2d");

ctx.drawImage(img,0,0);
if(canvas.height && canvas.width){
var imgPixels = ctx.getImageData(0,0,canvas.width,canvas.height);


var r=0;
var g=0;
var b=0;
var count=0;

var px_data= imgPixels.data;
  for(var i = 0; i<px_data.length - 40; i=i+4*10){  
        
            count++;
           r=  r+px_data[i];
           g=  g+ px_data[i + 1] ;
           b=  b+ px_data[i + 2]  ;  
        }  


r=Math.floor(r/count);
g=Math.floor(g/count);
b=Math.floor(b/count);

document.getElementById("header-wrap").style.backgroundColor = 
document.body.style.borderColor = 'rgb(' + r + ',' + g + ',' + b + ')';
}
}
}


function spinner(opt){

	switch(opt) {

		case 'show':
        $(".spinner_container").fadeIn(50);

        break;

    	case 'hide':
         $(".spinner_container").fadeOut(50);

        break;


    default:
        $(".spinner_container").hide();

	}

}