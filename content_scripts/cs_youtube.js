var Name = '';
var ImgSrc ='';

var trackChangeInterval = setInterval(function() {
	checkTrackChange();
}, 3000);


function checkTrackChange() {
	var prevName = Name;
	fetchTrackInfo();
	if (Name !== prevName) {
		chrome.runtime.sendMessage({'title' : Name,'msg' : 'youtube_data','imgsrc':ImgSrc});
	}
}

function fetchTrackInfo(){
Name=$('.watch-main-col meta[itemprop="name"]').attr('content');
ImgSrc=$('.watch-main-col link[itemprop="thumbnailUrl"]').attr('href');
ImgSrc=ImgSrc.replace('maxresdefault','default');

}