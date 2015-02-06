var Name = '';
var album = '';
var Artist1 = '';
var ImgSrc ='';


var trackChangeInterval = setInterval(function() {
	checkTrackChange();
}, 3000);


function checkTrackChange() {
	var prevName = Name;
	fetchTrackInfo();
	if (Name !== prevName) {
		chrome.runtime.sendMessage( {'msg' : 'trackInfo','artist' : Artist1,'title' : Name,'album' : album,'imgsrc':ImgSrc});
		
	}
}



