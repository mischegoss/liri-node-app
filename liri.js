require("dotenv").config();
var spotify = new Spotify(keys.spotify);

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
      case 'choice1':
        console.log ('You picked one')
        break;
      case 'choice2':
        console.log ('You picked two')
        break;
      default:
        // code block
    }
  }
  );
}
askFirstPrompt();