//gaana.com
function fetchTrackInfo(){
  var prevName=Name;
  Name = '';
  album = '';
  Artist1 = '';
  artists = '';
  div_trackInfo = document.getElementById('trackInfo');
  
  if (!div_trackInfo || div_trackInfo.children.length === 0){
      return;
  }
  
      tx=$("#tx");
      if(tx.length === 0) return;
      Name = tx.get(0).firstChild.nodeValue.trim();
      album = tx.find("span").eq(0).find("a").text().trim();
      Artist1 = tx.find("span").eq(1).find("a").eq(0).text().trim();
  

  if (Name === "Gaana Promotional"){Name = prevName;}
  }