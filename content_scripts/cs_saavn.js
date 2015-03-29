Name = album = Artist1 = ImgSrc = '';


var trackChangeInterval = setInterval(function() {
	var prevName = Name;
	fetchTrackInfo();
	if (Name !== prevName && Name) {
		chrome.runtime.sendMessage( {'msg' : 'trackInfo','artist' : Artist1,'title' : Name,'album' : album,'imgsrc':ImgSrc, 'site' : 'http://www.saavn.com/*'});
	}
}, 3000);



//saavn.com
function fetchTrackInfo() {
	Name = album = Artist1 = ImgSrc = '';

	Name = document.getElementById('player-track-name').innerText;
	album = document.getElementById('player-album-name').innerText;
	
	songJSONDivs = $(".song-json");
	for (var i = 0; i < songJSONDivs.length; i++) {
		obj = eval("(" + songJSONDivs[i].innerText + ")");
		if (obj.title.trim() === Name.trim()) {
			singers = obj.singers;
			commaIndex = singers.indexOf(",");
			Artist1 = (commaIndex === -1)?singers:singers.substring(0, commaIndex);
			
		}
	}
	
	ImgSrc = $('#now-playing').find('.key-art').css('background-image');
	ImgSrc=ImgSrc.replace('url(','').replace(')','');
	
	
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    if (request.msg == "play"){

    if($('#play')[0].getAttribute('class') == "controls" ) $('#play')[0].click();
      else $('#pause')[0].click();
  		}

       if (request.msg == "next")
      $('#fwd')[0].click();

       if (request.msg == "prev")
      $('#rew')[0].click();

       if (request.msg == "shuffle")
      $('#shuffle')[0].click();

           if (request.msg == "repeat")
     $('#repeat')[0].click();



  });