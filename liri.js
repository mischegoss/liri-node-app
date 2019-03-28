/* This is not complete! I have been working overtime and work and had hell week but  I wanted to turn something in to show it is a 
   work in progress. 
 * I am working hard to complete, please show mercy!  Right now spotify, concert-this and Do This are coded, I still
 * have to code the other options and give each option its own file. */

 /* TO DO: Finish coding other options. Clean up code by giving each option its own .js file. Repackage the spotify grab so that it
    can be used with our without Inquirer.   Write README list showing completed options.
   Get rid of visible Spotify code by using envelope */
  


   require("dotenv").config();

   var keys = require("./keys");
   var request = require("request");
   var fs = require("fs");
   var Spotify = require("node-spotify-api");
   var moment = require("moment");
   
  /* var spotify = new Spotify(keys.spotify);*/
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
        console.log ('Sure Thing');
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
    { type: 'input', name: 'artistname', message: 'What artist are you looking for?', filter: function(val) {
      return val.toLowerCase();
    }
  }
])
.then(function(answers) {
  var concertanswer = answers.artistname
  var concertanswertrimmed = concertanswer.trim();
  console.log(concertanswertrimmed)

  var queryURL = "https://rest.bandsintown.com/artists/" + concertanswer + "/events?app_id=codingbootcamp";

    request(queryURL, function (error, body) {
        if (error) console.log(error);
        var result  =  JSON.parse(body)[0];
        console.log("Venue name " + result.venue.name);
        console.log("Venue location " + result.venue.city);
        console.log("Date of Event " +  moment(result.datetime).format("MM/DD/YYYY")); 
       


    })

 

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

      /* Need to fix this so it uses term, not goes to inquirer */ 
            let mytrack = term;
            spotifyAction(term);
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