/* The Special Counsel Report came at the wrong time. This is not done
 * TO DO: Code Concert-This, Movie-This and Do What It Says
 * Use envelope properly.
 * Add txt file and bonus.
 * Add ReadME
 * Working as fast as I can to get this done. But meanwhile, my Spotify works!
 * Will be done by Wednesday evening. Sorry for the delay! Darn Mueller! */


require("dotenv").config();
var Spotify = require('node-spotify-api');
var spotify = new Spotify({
    id: '88a18c33735646268279b54130d7cc64',
    secret: 'b7cd943cf1f549198daf3d9abc352546'
  });



/* This is the initial prompt to direct to which API */
var inquirer = require('inquirer');

function askFirstPrompt() {
  inquirer.prompt ([
    {
      type: 'list',
      name: 'apiPicker',
      message: 'What would you like to do?',
      choices: ['concert-this', 'spotify-this-song', 'movie-this', 'do-what-it-says', 'exit']/*,
      filter: function(val) {
        return val.toLowerCase();
      }
      */
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
       movieThis();
        break;
        case 'do-what-it-says':
        console.log ('You picked two')
        break;
        case 'exit':
        console.log ('Bye!')
        break;
      default:
        console.log("Ugh, oh! How did we get here????")
        break;
    }
  }
  );
}

/* Start Movie-This */




/* Start Spotify */
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
        var mytrack = answers.spot_song.trim();
        var tracklength = mytrack.length
        console.log(mytrack)
        spotify.search({ type: 'track', query: mytrack}, function(err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            } 
            var pickedsong = data.tracks.items[0].name
            var pickedsonglower = pickedsong.toLowerCase();
            var pickedsonglowersub = pickedsonglower.substring(0, tracklength)
            console.log(pickedsonglowersub)
            
            if ((mytrack !== pickedsonglowersub) || pickedsong == undefined)  {
                console.log("Uh oh, looks like that didn't quite work");
                tryAgainSpot()


            } else {
            console.log("Artist: " + data.tracks.items[0].artists[0].name + "\nSong name: " + data.tracks.items[0].name +
            "\nAlbum Name: " + data.tracks.items[0].album.name + "\nPreview Link: " + data.tracks.items[0].preview_url); 
            askFirstPrompt();
            }  
        });

    })
}

function tryAgainSpot() {
  
        inquirer.prompt ([
          {
            type: 'list',
            name: 'tryagain',
            message: 'Would you like to try again?',
            choices: ['yes', 'no', 'Just give me any song, already!']
          }
        ])
      
        .then(function(answers) {
          var tryagainresponse = answers.tryagain
          switch(tryagainresponse) {
            case 'yes':
            spotifyAction();
              break;
            case 'no':
              console.log ('Bye, then!')
              break;
              case 'Just give me any song, already!':
              console.log ('Here\'s your song')
              playRandomSong()
              break;
            default:
              console.log("Ugh, oh! How did we get here????")
              break;
          }
        }
        );
      }

function playRandomSong() {

spotify.search({ type: 'track', query: 'ace+of+base+sign' + '&limit=1&'},  function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
   
    console.log("Artist: " + data.tracks.items[0].artists[0].name + "\nSong name: " + data.tracks.items[0].name +
    "\nAlbum Name: " + data.tracks.items[0].album.name + "\nPreview Link: " + data.tracks.items[0].preview_url); 
    askFirstPrompt();
  });
}
/* End Spotify */
askFirstPrompt()