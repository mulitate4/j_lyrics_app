const searchButton = document.querySelector(".searchButton");
var songInput = document.querySelector(".searchInput");
var lyricsDiv = document.querySelector(".lyricsDiv");

addSongName = function(songName){
    var songNameh3Exists = document.querySelector('.songName') || false
    if (songNameh3Exists != false){
        songNameh3Exists.innerHTML = songName;
    }else{
        let songNameH3 = document.createElement('h3');
        songNameH3.classList.add('songName');
        songNameH3.innerHTML = songName;
        lyricsDiv.appendChild(songNameH3);
    }
}

addLyrics = function(lyrics){
    let pLyr = document.querySelector("p") || document.createElement("p");
    pLyr.innerHTML = lyrics;
    lyricsDiv.appendChild(pLyr);
}

async function main(query){
    let lyrFinal = "";
    fetchURL = 'https://lyricist-app-banckend.herokuapp.com/?q='+query;

    let lyrics = await fetch(fetchURL, {
        method: 'GET'
    })
    .then(e => e.text());

    lyr = await lyrics;
    lyrSplit = lyrics.split("\n");

    for(let i=2; i<lyrSplit.length; i++){
        lyrFinal += lyrSplit[i] + "</br>" 
    }
    let song = lyrSplit[0]
    let artist = lyrSplit[1]

    songAndArtist = song + ' by ' + artist;

    addSongName(songAndArtist);
    addLyrics(lyrFinal);
}

function check(){
    let song = songInput.value;
    if (song != ""){
        songInput.value = "";
        main(song);
    }
}

searchButton.addEventListener('click', () => {
    check()
});