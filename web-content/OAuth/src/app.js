//dependencies
var express = require('express');
var session = require('express-session');
var passport = require('passport');

//passport auth strategy
var BnetStrategy = require('passport-bnet').Strategy;

//Get keys
var PropertiesReader = require('PropertiesReader');
var properties =  PropertiesReader('../resources/conf.properties');
var consumerKey = properties.get('consumerKey');
var consumerSecret = properties.get('consumerSecret');

//utils
var util = require('util');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

//require routes

passport.use(
  new BnetStrategy(
    {clientID: consumerKey,
      clientSecret: consumerSecret,
      region: "us";
      callbackURL: "https://localhost:3000/auth/bnet/callback"},

      function(accessToken, refreshToken, profile, done){
        console.log(profile)
        console.log(accessToken)
        process.nextTick(function(){
          return done(null, profile);
        });
      });
    );


var app = express();

app.

// configure Express
app.use(cookieParser());
app.use(session({ secret: 'blizzard',
saveUninitialized: true,
  resave: true }));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());


//Server API calls
//authenticate
app.get('/bnet',
passport.authenticate('bnet'));

app.get('/bnet/callback',
passport.authenticate('bnet', { failureRedirect: '/' }),
function(req, res){
  res.redirect('http://localhost:3000');
});

app.get('/', function(req, res) {
  if(req.isAuthenticated()) {
    var output = '<h1>Osixes Signin</h1>' + req.user.id + '<br>';
    if(req.user.battletag) {
      output += req.user.battletag + '<br>';
    }
    output += '<a href="/logout">Logout</a>';
    res.send(output);
  } else {
    res.send('<h1>Login with Bnet</h1>' +
    '<a href="/auth/bnet">Login with Bnet</a>');
  }
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});

app.listen(8000);
