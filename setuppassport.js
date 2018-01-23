var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function() {
  passport.serializeUser(function(username, done){
    switch(username){
      case "UserA":
        done(null, 1);
        break;
      case "UserB":
        done(null, 2);
        break;
      case "UserC":
        done(null, 3);
        break;
      default:
        done(null, 0);
    }
  });

  passport.deserializeUser(function(id, done){
      switch(id){
        case 1:
          done(null, "UserA");
          break;
        case 2:
          done(null, "UserB");
          break;
        case 3:
          done(null, "UserC");
          break;
        default:
          done(new Error("No user match for id " + id), "no user");
      }
  });

  // TEST STATE
  passport.use("login", new LocalStrategy(
    function(username, password, done) {
      // Right now by default accepts a UserA, UserB, and UserC
      if (username == "UserA" || username == "UserB" || username == "UserC") {
        // Successful login
        return done(null, username);
      } else {
        // Invalid login
        return done(null, false,
          { message: "Invalid username." });
      }
    }
  ));
};
