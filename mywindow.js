
window.onload = function() {
	mainView = document.getElementById('main');
	header = document.getElementById("header");
	artist_name=document.getElementById('artist_name');
     $('.scrollbar').perfectScrollbar();
	artist = '';
	title = '' ;
	album ='';
	site_name ='';
	var background = chrome.extension.getBackgroundPage();

addEventListener("unload", function (event) {
    background.popupActive= false;
}, true);
	
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

function input(){


$(".img-holder").hide();
$("#imgart").hide();

document.getElementById("header-wrap").style.backgroundColor =
document.body.style.borderColor ='#4285f4';

artist = document.getElementById("artist").value;
title = document.getElementById("title").value;
spinner('show');
getLyrics(artist, title);
}
	



chrome.runtime.sendMessage({'msg':'getTrackInfo'},function(request){

$(".img-holder").show();
$("#imgart").show();
spinner('show');
	
	
	  
	  
    if(request.site == 'youtube'){
	
	
	header.innerHTML = '' ;
	processYoutubeData(request.title);
	//searchLyricsWikia_google(request.title);

	}

	else {
	
	   getLyrics(request.artist, request.title, request.album);
	 
	  }

	  site_name=request.site;
	  handlePlayer(request.site);
	  $("#imgart").attr("src", request.imgsrc);
	  changeToDominantColor(request.imgsrc);

	
});

chrome.runtime.onMessage.addListener(function(request, sender,
		sendResponse) {

	$(".img-holder").show();
	$("#imgart").show();
	spinner('show');

	if (request.msg == "change") {
	


	if(request.site == 'youtube'){
	
	
	//mainView.innerHTML = "Searching lyrics...";
	
	processYoutubeData(request.title);
	//searchLyricsWikia_google(request.title);
	}

	else {
	
	
	//mainView.innerHTML = "Searching lyrics...";
	
	getLyrics(request.artist, request.title, request.album);
	
	
	}
	
	 
	site_name=request.site;
	handlePlayer(request.site);
	$("#imgart").attr("src", request.imgsrc);
	changeToDominantColor(request.imgsrc);

	}
});



function setHeader(artist, title)
{
	if (title){
		header.innerHTML = title;
		artist_name.innerHTML=artist;
		$("#artist_name").show(700);
	}
}


function getLyrics(artist, title, album) 
{
	
	closePopup();
 
	if (!title) {
		spinner('hide');
		mainView.innerHTML = 'Cannot Get Song title... :-( </br> You May Try Searching Manually';
			setHeader('---','---');
			setTimeout(openPopup, 3500);
		return; 
	}

	if (!artist) {
		mainView.innerHTML = 'Searching Artsist Name...';
		getArtistFromMusicBrainz(title, album);
		
		return;
	}
	
	setHeader(artist, title);
	
	getURLFromLyricWiki(artist, title);
	

}




function processYoutubeData(str){

	closePopup();
	
	str = (str).replace(/ (Feat|ft|feat|Ft).*?\-/i, '');

	//CLEANING title...
			if(/(ft|feat|Feat|Ft)/gi.test(str))
			{
			str = (str).replace(/ (ft|feat|Feat|Ft).*/i, '');
			}
			
			var str_arr=[/official/gi,/video/gi,/full/gi,/song/gi,/exclusive/gi,/title/gi,/audio/gi,/latest/gi,/unplugged/gi,/bollywood/gi,/sing/gi,/along/gi,/(HD|HQ)/,/remix/gi,/Original/gi,/lyrical/gi,/Lyrics/gi];
			for(i=0;i<str_arr.length;i++)
			{
			str = (str).replace(str_arr[i], '');
			}
			
			// condition whether to Get Lyrics by Youtube method or Other method....
			var patt_title3 = new RegExp(/ \s*\|.*/g);
			var patt_title1 = new RegExp(/\s*\'.*?\'\s*/g);
			var patt_title2 = new RegExp(/\s*\".*?\"\s*/g);


			var patt_title4 = new RegExp(/ \s*\I .*/g);
			
			if(patt_title1.test(str)||patt_title2.test(str)||patt_title3.test(str)||patt_title4.test(str))
			{
			
			(str).replace(/ \s*\I .*/g, '');
			str = (str).replace(/ \s*\|.*/g, '');
			str = (str).replace(/\s*\|.*?\|\s*/g, ''); // Remove |.*|
			str = str.replace(/^(|.*\s)'(.*)'(\s.*|)$/, '$2'); // capture 'Track title'
			str = str.replace(/^(|.*\s)"(.*)"(\s.*|)$/, '$2'); // capture "Track title"
			str = (str).replace(/\s*\[.*?\]\s*/g, ' ');
			str = (str).replace(/\s*\(.*?\)\s*/g, ' ');
			

			patt_str=new RegExp('-');
			if(patt_str.test(str)){
			
			var commaIndex = str.indexOf("-");
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
				searchLyricsWikia_google(title);
				
			
}





function changeToDominantColor(srcImg){


if(srcImg)
{
	
var img = new Image();

img.onload=function(){

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

document.getElementById("player").style.backgroundColor =
document.getElementById("header-wrap").style.backgroundColor = 
document.body.style.borderColor = 'rgb(' + r + ',' + g + ',' + b + ')';
}
}

img.src =srcImg;


}

}


function spinner(opt){

	switch(opt) {

		case 'show':
        $(".spinner_container").fadeIn(250);

        break;

    	case 'hide':
         $(".spinner_container").fadeOut(250);

        break;


    default:
        $(".spinner_container").hide();

	}

}


// For PLayer///////////////////////////////////////////////////


function handlePlayer(site){

if(site == 'http://gaana.com/*' || site == 'http://www.saavn.com/*' ){

$('.scrollbar').animate({height:'360px'}, 500);
$('#player').show(500);
$('#player').removeAttr('display');
$("#player").css("display", "flex");
}

else{

$('.scrollbar').animate({height:'410px'}, 500);
$('#player').hide(500);
}




}



///// Event listeners 


document.addEventListener('DOMContentLoaded', function () {



  document.getElementById('play').addEventListener('click', function(){

chrome.tabs.query({'url': site_name },function(tabs){

 chrome.tabs.sendMessage(tabs[0].id, {msg: "play"}, function(response) {
   
      });
 });
  });


document.getElementById('next').addEventListener('click', function(){

chrome.tabs.query({'url': site_name},function(tabs){

 chrome.tabs.sendMessage(tabs[0].id, {msg: "next"}, function(response) {
   
      });
  });
  });

document.getElementById('prev').addEventListener('click', function(){

chrome.tabs.query({'url': site_name },function(tabs){

 chrome.tabs.sendMessage(tabs[0].id, {msg: "prev"}, function(response) {
   
      });
  });
  });



document.getElementById('shuffle').addEventListener('click', function(){

chrome.tabs.query({'url': site_name},function(tabs){

 chrome.tabs.sendMessage(tabs[0].id, {msg: "shuffle"}, function(response) {
   
      });
  });
  });


document.getElementById('repeat').addEventListener('click', function(){

chrome.tabs.query({'url': site_name },function(tabs){

 chrome.tabs.sendMessage(tabs[0].id, {msg: "repeat"}, function(response) {
   
      });
    });
  });



});

