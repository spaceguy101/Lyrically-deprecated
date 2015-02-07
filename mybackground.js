artist = '';
title = '' ;
album ='';
site='others';
imgsrc='';
chrome.tabs.onUpdated.addListener(checkForValidUrl);

function checkForValidUrl(tabId,Info, tab) {
 
 if (Info.status == "loading") return;
 if ((tab.url.indexOf('saavn.com') > -1) && (Info.status == "complete")
	||(tab.url.indexOf('gaana.com') > -1) && (Info.status == "complete")
	||(tab.url.indexOf('rdio.com') > -1) && (Info.status == "complete")
	||(tab.url.indexOf('hungama.com') > -1) && (Info.status == "complete")
	||(tab.url.indexOf('youtube.com/watch') > -1) && (Info.status == "complete")
	||(tab.url.indexOf('bop.fm') > -1) && (Info.status == "complete"))
    chrome.pageAction.show(tabId);
};

chrome.pageAction.onClicked.addListener(iconClicked);

function iconClicked (tab,tabId){

{
		chrome.windows.create({'url': 'mywindow.html', 'type': 'panel','width': 350,
		    'height': 530}, function(windowInfo) {
    var _isPanelEnabled;
var _isPanelEnabledQueue = [];
function getPanelFlagState(callback) {
    if (typeof callback != 'function') throw Error('callback function required');
    if (typeof _isPanelEnabled == 'boolean') {
        callback(_isPanelEnabled); // Use cached result
        return;
    }
    _isPanelEnabledQueue.push(callback);

    if (_isPanelEnabled == 'checking')
        return;

    _isPanelEnabled = 'checking';
    chrome.windows.create({
        url: 'about:blank',
        type: 'panel'
    }, function(windowInfo) {
        _isPanelEnabled = windowInfo.alwaysOnTop;
        chrome.windows.remove(windowInfo.id);

        // Handle all queued callbacks
        while (callback = _isPanelEnabledQueue.shift()) {
            callback(windowInfo.alwaysOnTop);
        }
    });
}

getPanelFlagState(function(isEnabled) {
if(!isEnabled){
	chrome.tabs.create({url: "chrome://flags/#enable-panels"}, null);
    chrome.tabs.create({'url': 'popup.html'});
	}
});
});
}
}


chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
  // When we get a message from the content script
  if(message.msg == 'trackInfo'){
    artist = message.artist;
	title = message.title.replace(/\s*\(.*?\)\s*/g, '');
	album=message.album;
	imgsrc=message.imgsrc;
	site='others';
	chrome.runtime.sendMessage({'msg':'change','artist':artist ,'title':title,'album':album,'site':site,'imgsrc':imgsrc});
	}
	
	//for youtube..
	else if(message.msg == 'youtube_data'){
	 
			
			imgsrc=message.imgsrc;
        	str=message.title;
			//cleaning title
			
			// Put If else condition whether to Get Lyrics by Youtube method or Other method....
			var patt_title3 = new RegExp(/ \s*\|.*/g);
			var patt_title1 = new RegExp(/\s*\'.*?\'\s*/g);
			var patt_title2 = new RegExp(/\s*\".*?\"\s*/g);
			//var patt_title3 = new RegExp('|');
			
			if(patt_title1.test(str)||patt_title2.test(str)||patt_title3.test(str))
			{
			site='others';
			//clean title for indian songs
			str = (str).replace(/ (ft|feat|featuring).*?\-/i, '');
			
			if(/(ft|feat)/g.test(str))
			{
			str = (str).replace(/ (ft|feat|featuring).*/i, '');
			}
			str = (str).replace(/ \s*\|.*/g, '');
			str = str.replace(/\s+(HD|HQ)\s*$/, ''); // HD (HQ)
			str = (str).replace(/\s*\|.*?\|\s*/g, ''); // Remove |.*|
			str = str.replace(/^(|.*\s)'(.*)'(\s.*|)$/, '$2'); // capture 'Track title'
			str = str.replace(/^(|.*\s)"(.*)"(\s.*|)$/, '$2'); // capture "Track title"
			str = (str).replace(/\s*\[.*?\]\s*/g, '');
			str = (str).replace(/\s*\(.*?\)\s*/g, '');
			var str_arr=[/official/i,/video/i,/full/i,/song/i,/exclusive/i,/title/i,/audio/i];
			for(i=0;i<str_arr.length;i++)
			{
			str = (str).replace(str_arr[i], '')
			}
				
		
			
			
			
			patt_str=new RegExp('-');
			if(patt_str.test(str)){
			
			commaIndex = str.indexOf("-");
			 title_sony = str.substring(0, commaIndex);
			 album_sony = str.substring(commaIndex+1, str.length);

			getDataFromMusicBrainz_albumAndTitle(title_sony,album_sony);
			}
				else getDataFromMusicBrainz(str);
			}
			
			
			
			//For Non-Indian
			else{
			
			youtubeMethod(str);
			
			}
			
	}
	
	//from window
	if(message.msg == 'getTrackInfo'){
          sendResponse({'artist':artist ,'title':title,'album':album,'site':site,'imgsrc':imgsrc});
	}
});



/*
chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
		
	}
});
*/

function getDataFromMusicBrainz(title1) {

	site='others';
	query = 'recording:' + title1 + ' AND country:IN';

	$
			.ajax({
				url : "http://musicbrainz.org/ws/2/recording",
				data : {
					query : query
				},
				type : "GET",
				error : function(jqXHR, textStatus, errorThrown) {
					console.log("Error calling MusicBrainz api!");
					searchGoogle(title1);
				},
				success : function(data, status) {
				
					title_arr=$(data).find("title");
					
					artistCredit = $(data).find("artist-credit");
					if (artistCredit.length > 0 && title_arr.length > 0) {
						
						artist= artistCredit[0].getElementsByTagName("artist")[0]
								.getElementsByTagName("name")[0].textContent;
						
						title=title_arr[0].textContent;
						
						console.log("Artist name retrieved from MusicBrainz: "
								+ artist+'title  '+title);
								
					title = (title).replace(/\s*\(.*?\)\s*/g, '');
					chrome.runtime.sendMessage({'msg':'change','artist':artist ,'title':title,'album':album,'site':'others','imgsrc':imgsrc});		
								
						
					} else {
						console.log("MusicBrainz returned 0 results");
						searchGoogle(title1);
						
					}
				}

			});
			
}


function getDataFromMusicBrainz_albumAndTitle(title2,album2) {
	title2=title2.trim();
	album2=album2.trim();
	site='others';
	
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
					chrome.runtime.sendMessage({'msg':'change','artist':artist ,'title':title,'album':album,'site':'others','imgsrc':imgsrc});		
								
						
					} else {
						console.log("MusicBrainz returned 0 results");
						searchGoogle(title2);
						
					}
				}

			});
}


function youtubeMethod(str){
			site='youtube';
			str = (str).replace(/ (ft|feat).*?\-/i, ' -');
			
			if(/(ft|feat)/g.test(str))
			{
			str = (str).replace(/ (ft|feat).*/i, '');
			}
			
			str = str.replace(/\s+(HD|HQ)\s*$/, ''); // HD (HQ)
			 str = str.replace(/\s*\(\s*[0-9]{4}\s*\)/i, ''); // (1999)
			str = (str).replace(/\s*\[.*?\]\s*/g, '');
			str = (str).replace(/\s*\(.*?\)\s*/g, '');
			
			var str_arr=[/official/i,/video/i,/full/i,/song/i,/exclusive/i,/title/i,/live/i,/audio/i];
			for(i=0;i<str_arr.length;i++)
			{
			str = (str).replace(str_arr[i], '')
			}
			//str = str.replace(/^(|.*\s)'(.*)'(\s.*|)$/, '$2'); // 'Track title'
			//str = str.replace(/^(|.*\s)"(.*)"(\s.*|)$/, '$2'); // 'Track title'
			
			if(/-/.test(str)&&(str.indexOf('-')!=str.lastIndexOf('-')))
			{
				str=str.replace(/-/,'');
				
				
			commaIndex = str.indexOf("-");
			 title_sony = str.substring(0, commaIndex);
			 album_sony = str.substring(commaIndex+1, str.length);
			getDataFromMusicBrainz_albumAndTitle(title_sony,album_sony);
		
			}
			else
			{
			
			searchGoogle(str);
			}
}

function searchGoogle(title)
{
				title=title.replace(/[:;~*]/g,'');
				chrome.runtime.sendMessage({'msg':'change','title':title,'site':'youtube','imgsrc':imgsrc});
				
			
}