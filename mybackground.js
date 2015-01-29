artist = '';
title = '' ;
album ='';
site='others';
urll='';
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
	site='others';
	chrome.runtime.sendMessage({'msg':'change','artist':artist ,'title':title,'album':album,'yt_url':urll,'site':site});
	}
	
	//for youtube..
	else if(message.msg == 'youtube_data'){
	 
			
			
        	str=message.title;
			//cleaning title
			
			// Put If else condition whether to Get Lyrics by Youtube method or Other method....
			var patt_title3 = new RegExp(/\s*\|.*?\|\s*/g);
			var patt_title1 = new RegExp(/\s*\'.*?\'\s*/g);
			var patt_title2 = new RegExp(/\s*\".*?\"\s*/g);
			//var patt_title3 = new RegExp('|');
			
			if(patt_title1.test(str)||patt_title2.test(str)||patt_title3.test(str))
			{
			site='others';
			//clean title for indian songs
			
			str = (str).replace(/ \s*\|.*/g, '');
			str = str.replace(/\s+(HD|HQ)\s*$/, ''); // HD (HQ)
			str = (str).replace(/\s*\|.*?\|\s*/g, ''); // Remove |.*|
			str = str.replace(/^(|.*\s)'(.*)'(\s.*|)$/, '$2'); // capture 'Track title'
			str = str.replace(/^(|.*\s)"(.*)"(\s.*|)$/, '$2'); // capture "Track title"
			str = (str).replace(/\s*\[.*?\]\s*/g, '');
			str = (str).replace(/\s*\(.*?\)\s*/g, '');
			var str_arr=['Official','official','OFFICIAL','Video','VIDEO','Full','FULL','Song','Exclusive','EXCLUSIVE','Audio']
			for(i=0;i<str_arr.length;i++)
			{
			str = (str).replace(str_arr[i], '')
			}
				
			console.log(str);
			
			
			
			patt_str=new RegExp('-');
			if(patt_str.test(str)){
			//For sony vevo india//BROKEN !!! Fix this
			commaIndex = str.indexOf("-");
			 title_sony = str.substring(0, commaIndex);
			 album_sony = str.substring(commaIndex+1, str.length);
			// console.log(title_sony + "  |  "+  album_sony);
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
          sendResponse({'artist':artist ,'title':title,'album':album,'yt_url':urll,'site':site});
	}
});



/*
chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
		
	}
});
*/

function getDataFromMusicBrainz(title1) {

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
				},
				success : function(data, status) {
				
					title_arr=$(data).find("title");
					title=title_arr[0].textContent;
					
					artistCredit = $(data).find("artist-credit");
					if (artistCredit.length > 0 && title) {
						artist= artistCredit[0].getElementsByTagName("artist")[0]
								.getElementsByTagName("name")[0].textContent;
						
						
						console.log("Artist name retrieved from MusicBrainz: "
								+ artist+'title  '+title);
								
					title = (title).replace(/\s*\(.*?\)\s*/g, '');
					chrome.runtime.sendMessage({'msg':'change','artist':artist ,'title':title,'album':album,'site':'others'});		
								
						
					} else {
						console.log("MusicBrainz returned 0 results");
						
						
					}
				}

			});
			
}


function getDataFromMusicBrainz_albumAndTitle(title2,album2) {
	title2=title2.trim();
	album2=album2.trim();
	//console.log('Title'+title2);
	//console.log('Albym'+album2);
	query = 'recording:' + title2 + ' AND release:'+ album2 ;

	$
			.ajax({
				url : "http://musicbrainz.org/ws/2/recording",
				data : {
					query : query
				},
				type : "GET",
				error : function(jqXHR, textStatus, errorThrown) {
					console.log("Error calling MusicBrainz api!");
				},
				success : function(data, status) {
				
					title_arr=$(data).find("title");
					title=title_arr[0].textContent;
					
					artistCredit = $(data).find("artist-credit");
					if (artistCredit.length > 0 && title) {
						artist= artistCredit[0].getElementsByTagName("artist")[0]
								.getElementsByTagName("name")[0].textContent;
						
						
						console.log("Artist name retrieved from MusicBrainz: "
								+ artist+'title  '+title);
								
					title = (title).replace(/\s*\(.*?\)\s*/g, '');
					chrome.runtime.sendMessage({'msg':'change','artist':artist ,'title':title,'album':album,'site':'others'});		
								
						
					} else {
						console.log("MusicBrainz returned 0 results");
						
						
					}
				}

			});
}


function youtubeMethod(str){
			site='youtube';
			str = (str).replace(/ (Ft|ft|feat|featuring).*?\-/, '');
			var patt = /(ft|feat|featuring)/g;
			if(patt.test(str))
			{
			str = (str).replace(/ (ft|feat|featuring).*/, '');
			}
			str = str.replace(/\s+\(?live\)?$/i, ''); // live
			str = str.replace(/\s+(HD|HQ)\s*$/, ''); // HD (HQ)
			 str = str.replace(/\s*\(\s*[0-9]{4}\s*\)/i, ''); // (1999)
			str = (str).replace(/\s*\[.*?\]\s*/g, '');
			str = (str).replace(/\s*\(.*?\)\s*/g, '');
			
			var str_arr=['Official','official','OFFICIAL','Video','VIDEO','Full','FULL','Song','Exclusive','EXCLUSIVE']
			for(i=0;i<str_arr.length;i++)
			{
			str = (str).replace(str_arr[i], '')
			}
			str = str.replace(/^(|.*\s)'(.*)'(\s.*|)$/, '$2'); // 'Track title'
			str = str.replace(/^(|.*\s)"(.*)"(\s.*|)$/, '$2'); // 'Track title'
			str = str.replace(/^[\/\s,:;~-\s"]+/, ''); // trim starting white chars and dash
			str = str.replace(/[\/\s,:;~-\s"\s!]+$/, ''); // trim trailing white chars and dash 
			
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
			title=str;
			
			$.ajax({
			url: 'https://ajax.googleapis.com/ajax/services/search/web',
			data: {v:'1.0',q: 'site:lyrics.wikia.com -"Page Ranking Information"' + title},
			dataType: 'jsonp',
			type: 'GET',
			error: function(){},
			success: function(googledata){
			
				urll = googledata.responseData.results[0].unescapedUrl ;
				
				chrome.runtime.sendMessage({'msg':'change','title':title,'yt_url':urll,'site':site});
				
			}});
			}
}