artist = '';
title = '' ;
album ='';
site='';
imgsrc='';
popupActive= false;
popupId='';


chrome.tabs.onUpdated.addListener(function (tabId,Info, tab) {
 
 if (Info.status == "loading") return;
 if ((tab.url.indexOf('saavn.com') > -1) && (Info.status == "complete")
	||(tab.url.indexOf('gaana.com') > -1) && (Info.status == "complete")
	||(tab.url.indexOf('rdio.com') > -1) && (Info.status == "complete")
	||(tab.url.indexOf('hungama.com') > -1) && (Info.status == "complete")
	||(tab.url.indexOf('youtube.com/watch') > -1) && (Info.status == "complete")
	||(tab.url.indexOf('guvera') > -1) && (Info.status == "complete")
	||(tab.url.indexOf('raaga') > -1) && (Info.status == "complete")
	||(tab.url.indexOf('grooveshark') > -1) && (Info.status == "complete")
	||(tab.url.indexOf('spotify') > -1) && (Info.status == "complete")
	||(tab.url.indexOf('bop') > -1) && (Info.status == "complete"))
    chrome.pageAction.show(tabId);
});

chrome.runtime.onInstalled.addListener(checkIfPanel);

chrome.pageAction.onClicked.addListener(iconClicked);

function iconClicked ()
{

if(popupActive === false)
{
		chrome.windows.create({'url': 'mywindow.html', 'type': 'panel','width': 350,
'height': 495},function (popup) {
      popupId = popup.id;
    });

popupActive= true;
	}

else{

 chrome.windows.update(popupId, { "focused": true });
}

}


chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
  // When we get a message from the content script
  if(message.msg == 'trackInfo'){
    artist = message.artist;
	title = message.title.replace(/\s*\(.*?\)\s*/g, '').replace(/remix/i,'').replace(/ -.*/, '');
	album=message.album;
	imgsrc=message.imgsrc;
	site = message.site;
	chrome.runtime.sendMessage({'msg':'change','artist':artist ,'title':title,'album':album,'site':site,'imgsrc':imgsrc});
	}
	
	//for youtube..
	else if(message.msg == 'youtube_data'){
	 
			
			imgsrc=message.imgsrc.replace(/maxresdefault/g,'default');
        	title=message.title;
		    site='youtube';
			chrome.runtime.sendMessage({'msg':'change','title':title,'site':site,'imgsrc':imgsrc});
			
			
			
			
	}
	
	//from window
	if(message.msg == 'getTrackInfo'){
          sendResponse({'artist':artist ,'title':title,'album':album,'site':site,'imgsrc':imgsrc});
	}
});



function checkIfPanel (windowInfo) {
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
	else chrome.tabs.create({'url': 'popup1.html'});
});
}


/*
function search(){
	window.open("https://encrypted.google.com/#q=site:lyricsmasti.com+Lonely", '_blank', 'toolbar=no,status=no,menubar=no,scrollbars=no,resizable=no,left=10000, top=10000, width=10, height=10, visible=none', '')
}
*/