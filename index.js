genius = require("genius-api")
var genius = new api(process.env.GENIUS_CLIENT_ACCESS_TOKEN);

const searchButton = document.querySelector(".searchButton");
var songInput = document.querySelector(".searchInput");

getLyrics(songName){
    genius.search(songName)
}