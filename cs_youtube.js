var Name = '';

var trackChangeInterval = setInterval(function() {
	checkTrackChange();
}, 3000);


function checkTrackChange() {
	var prevName = Name;
	fetchTrackInfo();
	if (Name !== prevName) {
		chrome.runtime.sendMessage({'title' : Name,'msg' : 'youtube_data'});
	}
}

function fetchTrackInfo(){
Name=$('.watch-main-col meta[itemprop="name"]').attr('content');
}