function fetchTrackInfo()
{
  Name = '';
  album = '';
  Artist1 = '';
  trackName = $('#app-player').contents().find('#track-name a:first').text().trim();
  trackArtist = $('#app-player').contents().find('#track-artist a:first').text().trim();
  
  Name = trackName;
  Artist1 = trackArtist;
}