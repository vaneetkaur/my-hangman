var express = require('express');
var session = require('express-session');

var app = express();
app.use(express.static('client'));
app.use(session({ secret: 'my-hangman-secret', resave: false, saveUninitialized: true }));

require('./routes.js')(app);

var server = app.listen(3000, function() {
  console.log('my-hangman is listening on port 3000');
});