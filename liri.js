require("dotenv").config();
var Spotify = require('node-spotify-api');
var spotify = new Spotify({
    id: '88a18c33735646268279b54130d7cc64',
    secret: 'b7cd943cf1f549198daf3d9abc352546'
  });

var inquirer = require('fs');

/* This is the initial prompt to direct to which API */
var inquirer = require('inquirer');

var askFirstPrompt = function() {
  inquirer.prompt ([
    {
      type: 'list',
      name: 'apiPicker',
      message: 'What would you like to do?',
      choices: ['concert-this', 'spotify-this-song', 'movie-this', 'do-what-it-says'],
      filter: function(val) {
        return val.toLowerCase();
      }
      
    }
  ])

  .then(function(answers) {
    var response = answers.apiPicker
    switch(response) {
      case 'concert-this':
        console.log ('You picked one')
        break;
      case 'spotify-this-song':
        console.log ('Let\'s Find Your Song')
        spotifyAction();
        break;
        case 'movie-this':
        console.log ('You picked two')
        break;
        case 'do-what-it-says':
        console.log ('You picked two')
        break;
      default:
        console.log("Ugh, oh! How did we get here????")
        break;
    }
  }
  );
}

function spotifyAction() {
    inquirer.prompt ([
        {
            type: 'input',
            name: 'spot_song',
            message: "What song should I find for you?",
            filter: function(val) {
                return val.toLowerCase();
              }
          }
    ])
    .then(function(answers) {
        var mytrack = answers.spot_song
        console.log(mytrack)
        spotify.search({ type: 'track', query: mytrack}, function(err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            } 
            console.log("Artist: " + data.tracks.items[0].artists[0].name + "\nSong name: " + data.tracks.items[0].name +
            "\nAlbum Name: " + data.tracks.items[0].album.name + "\nPreview Link: " + data.tracks.items[0].preview_url); 
            
        });

    })
}
askFirstPrompt();