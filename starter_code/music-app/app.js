const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const SpotifyWebApi = require('spotify-web-api-node');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('layout', 'layouts/main-layout')
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

// Server Started
app.listen(3000, () => {
  console.log('My App listening on port 3000!');
});

// SpotifyApi
var clientId = 'ecb2b00819464137a16cfb7f9a88624c',
    clientSecret = 'e6627ac1e1e240089f4cce056e0fb2bd';

var spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

// Index
app.get('/', (req, res, next) => {
  res.render('home');
});

// Obtener a un artista individual
app.post('/artists', (req, res, next) => {
  spotifyApi.searchArtists(req.body.artist)
  .then(function(data) {
    res.render('artists', {data})
  }, function(err) {
    console.log(`This error is: ${err}`);
  });
});

// Obtener el album de un determinado artista
app.get('/albums/:artistId', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(function(data) {
    res.render('albums', {data})
  }, function(err) {
    console.error(`This error is: ${err}`);
  });
});

// Obtener las pistas del album
app.get('/tracks/:albumId', (req, res) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
  .then(function(data) {
    res.render('tracks', {data})
  }, function(err) {
    console.log(`This error is: ${err}`);
  });
});
