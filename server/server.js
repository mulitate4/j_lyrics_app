// Imports
const http = require('http');
const api = require('genius-api');
const $ = require('cheerio');
const axios = require('axios');
const request = require('request');

// Variables
const accessId = "0SFWrwArYYwBhc5zLllNT3BPJT74vnPnp4Qexk1LQBVmoVtC2w5dtmukUNcQKOKg";
const apiUrl = "https://api.genius.com/";
const baseUrl = "https://www.genius.com"

const host = "localhost";
const port = "8000";

// Initialization
let genius = new api(accessId);

// Get Url from the given Song Name/Artist
async function getUrl(songName){
  let fullSongUrl;

  let resp = await genius.search(songName).then((resp) => {
  
  // Extract URL from response
    let songUrl = resp.hits[0].result.path;
    fullSongUrl = baseUrl + songUrl;
    return fullSongUrl;
  })
  return resp;

}

// Get lyrics from the given Url
async function getSongName(body){
  let songName = body('.header_with_cover_art-primary_info-title').text();
  return songName;
}
async function getArtistName(body){
  let artistName = body('.header_with_cover_art-primary_info-primary_artist').text();
  return artistName;
}

async function getLyrics(body){
  let lyricsFinal = body('.lyrics').text().substring(37)

  return lyricsFinal;
}

async function getHTML(songUrl){
  let body = await axios(songUrl)
  .then(html => $.load(html.data));

  return body;
}

async function main(songName){
  let url = await getUrl(songName)
  .then(resp => resp);
  
  let body = await getHTML(url)
  .then(resp => resp);

  let artist = await getArtistName(body)
  .then(resp => resp);
  
  let song = await getSongName(body)
  .then(resp => resp);

  let lyr = await getLyrics(body)
  .then(resp => resp);

  return [song, artist, lyr];
}

// Server Function
async function requestListener(req, res){
  let data = ''
  res.writeHead(200);

  req.on('data', (chunk)=>{
    data += chunk;
  })

  await req.on('end', ()=>{
  })

  let lyr="";
  let artist='';
  let song='';

  while(lyr==""){
    response = await main(data)
    .then(resp => resp);
    lyr = response[2];
    artist = response[1];
    song = response[0];
  }

  res.end(song+"\n"+artist+"\n"+lyr);
}

// Create the Actual Server
const server = http.createServer(requestListener);

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});