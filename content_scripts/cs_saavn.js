//saavn.com
function fetchTrackInfo() {
	Name = '';
	album = '';
	Artist1 = '';

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
}