var Game = require('./game.js');

module.exports = function(app) {
  app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
  });

  app.get('/admin', function(req, res) {
    res.sendFile(__dirname + '/client/admin.html');
  });

  app.get('/start-new-game', function(req, res) {
    Game.getGame(req, res);
  });

  app.post('/verify-character/:character', function(req, res) {
    Game.verifyCharacter(req, res);
  });

  app.get('/get-list', function(req, res) {
    Game.getGamesList(res);
  });
};