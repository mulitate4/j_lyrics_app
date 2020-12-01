// Imports
const http = require('http');
const api = require('genius-api');
const $ = require('cheerio');
const axios = require('axios');

// Variables
const accessId = "0SFWrwArYYwBhc5zLllNT3BPJT74vnPnp4Qexk1LQBVmoVtC2w5dtmukUNcQKOKg";
const apiUrl = "https://api.genius.com/";
const baseUrl = "https://www.genius.com"

const host = process.env.HOST;
const port = process.env.PORT||8000;

// Initialization
let genius = new api(accessId);

// Get Url from the given Song Name/Artist
async function getUrl(songName){
  let fullSongUrl;

  let resp = await genius.search(songName)
  .then((resp) => {  
  // Extract URL from response
    console.log(resp)
    let songUrl = resp.hits[0].result.path;
    fullSongUrl = baseUrl + songUrl;
    return fullSongUrl;
  }).catch((e)=>{console.log(e)})
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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.writeHead(200);

  req.on('data', (chunk)=>{
    data += chunk;
  })

  await req.on('end', ()=>{
    console.log(data)
  })

  if (data != ''){
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
  }else{
    res.end("couldn't retrieve song")
  }
}

// Create the Actual Server
const server = http.createServer(requestListener);

server.listen(port, () => {
    console.log(`Server is running on ${process.env.HOST}:${port}`);
});