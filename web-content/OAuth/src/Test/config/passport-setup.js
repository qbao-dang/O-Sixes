const passport = require('passport');

//passport auth strategy
const BnetStrategy = require('passport-bnet').Strategy;

const PropertiesReader = require('properties-reader');
const properties =  PropertiesReader('../resources/config.properties');
const consumerKey = properties.get('consumerKey');
const consumerSecret = properties.get('consumerSecret');

passport.use(
  new BnetStrategy(
    { clientID: consumerKey,
      clientSecret: consumerSecret,
      callbackURL: "https://www.blizzard.com/en-gb/"},

      function(accessToken, refreshToken, profile, done){
        process.nextTick(function(){
          return done(null, profile);
        });
      }));
