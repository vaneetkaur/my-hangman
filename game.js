var available = require('./helper/words.json');

var gamesList = {};

function Game() {
  this.id = 0;
  this.phrase = '';
  this.phraseCurrentState = [];
  this.attemptsLeft = 10;
  this.status = 'new';
  this.playedCharacters = [];   
}

function randomPhrase(req, res) {
  return available.words[Math.floor(Math.random() * (249)) + 1];
}

module.exports.getGamesList = function(res) {
   res.json({ gamesList: gamesList });
}

module.exports.getGame = function(req, res) {
  var game = req.session.game;
  var startNewGame = game ? ((game.status === 'new' || game.status === 'in-progress')? false : true) : true;

  if (startNewGame) {
      game = new Game();
      game.phrase = randomPhrase().toUpperCase();
      for (var i = 0; i < game.phrase.length; ++i) {
        game.phraseCurrentState[i] =  game.phrase[i] === ' ' ? ' ' : '-';
      }
      gamesList[req.sessionID] = game;
  }
  req.session.game = game;  
  res.json({game: game, isCharacterInPhrase: null });
}

module.exports.verifyCharacter = function(req, res) {
  var characterToFind = req.params.character.toUpperCase();
  var game = req.session.game;  
  var isCharacterInPhrase = game.phrase.indexOf(characterToFind) >= 0;

  game.playedCharacters.push(characterToFind);
  
  if (isCharacterInPhrase) {
    for (var i = 0; i < game.phrase.length; ++i) {
      game.phraseCurrentState[i] =  game.phrase[i] === characterToFind ? characterToFind : game.phraseCurrentState[i];
    }
  } else {
    --game.attemptsLeft;
  }

  game.status = (game.phraseCurrentState.join('') === game.phrase ? 'won' : (game.attemptsLeft === 0 ?  'lost' : 'in-progress'));
  gamesList[req.sessionID] = game;
  req.session.game = game;  
  res.json({ game: game, isCharacterInPhrase: isCharacterInPhrase});
}