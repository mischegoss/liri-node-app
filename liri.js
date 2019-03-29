/* This is not complete! I have been working overtime and work and had hell week at work but  I wanted to turn something in to show it is a 
   work in progress. 
 *  Right now spotify, concert-this and Do This are coded, I still
 * have to code the other options and give each option its own file. */

 /* TO DO: Finish coding other options. Clean up code by giving each option its own .js file. Repackage the spotify grab so that it
    can be used with our without Inquirer.   Write README list showing completed options. */
   
  


   require("dotenv").config();

   var keys = require("./keys");
   var request = require("request");
   var fs = require("fs");
   var Spotify = require("node-spotify-api");
   var moment = require("moment");
   
   var spotify = new Spotify(keys.spotify);


/* This is the initial prompt to direct to which API */
var inquirer = require('inquirer');

function askFirstPrompt() {
  inquirer.prompt ([
    {
      type: 'list',
      name: 'apiPicker',
      message: 'What would you like to do?',
      choices: ['concert-this', 'spotify-this-song', 'movie-this', 'do-what-it-says', 'exit']
    }
  ])

  .then(function(answers) {
    var response = answers.apiPicker
    switch(response) {
      case 'concert-this':
        console.log ('Let\'s Find Your Concert')
        concertThisAction();
        break;
      case 'spotify-this-song':
        console.log ('Let\'s Find Your Song')
        spotifyAction();
        break;
        case 'movie-this':
       movieThis();
        break;
        case 'do-what-it-says':
        console.log ('Sure Thing...Here ya\' go');
        dowhatitSays();
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

/* Start Concert This */

function concertThisAction() {

  inquirer.prompt([
    { type: 'input', name: 'artistname', message: 'What artist are you looking for?',/*, filter: function(val) {
      return val.toLowerCase(); 
    }*/
  }
])
.then(function(answers) {
  var concertanswer = answers.artistname
  var concertanswertrimmed = concertanswer.trim();
  console.log(concertanswertrimmed)

  var queryUrl = "https://rest.bandsintown.com/artists/" + concertanswertrimmed + "/events?app_id=codingbootcamp";
  request(queryUrl, function(error, response, body) {
    // If the request is successful
   
    if (!error && response.statusCode === 200) {
      JSON.parse(body).forEach(function(element) {
        console.log("Venue name - " + element.venue.name);
        console.log(
          "Venue Location - " +
            element.venue.city +
            " , " +
            element.venue.region +
            "  - " +
            element.venue.country
        );
        console.log("Date - " + moment(element.datetime).format("MM/DD/YYYY"));
      });
    }
  });
 

})

};




/*Start Do What It Says */

function dowhatitSays() {
  fs.readFile("random.txt", "utf8", function (err, data) {
      if (err) throw err;

      var command = data.split(",")[0];
      var term = data.split(",")[1];

      saysHelper(command, term);
  });
};

function saysHelper(command, term) {
  switch (command) {
      case "concert-this":
           console.log("Got there")
          break;
      case "spotify-this-song":  
        console.log(term)
        spotify.search({ type: 'track', query: term + '&limit=1&'},  function(err, data) {
          if (err) {
            return console.log('Error occurred: ' + err);
          }
         
          console.log("Artist: " + data.tracks.items[0].artists[0].name + "\nSong name: " + data.tracks.items[0].name +
          "\nAlbum Name: " + data.tracks.items[0].album.name + "\nPreview Link: " + data.tracks.items[0].preview_url); 
          askFirstPrompt();
        });
        
          break;
      case "movie-this":
          Movie(term);
          break;
      case "do-what-it-says":
          dowhatitSays();
          break;
  }
}

/* This has unused options, right now! */ 





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