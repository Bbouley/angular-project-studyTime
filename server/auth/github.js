var passport = require('passport');
var GitHubStrategy = require('passport-github2');
var User = require('../models/user');
var config = require('../../_config');

passport.use(new GitHubStrategy({
    clientID: config.github.clientID,
    clientSecret: config.github.clientSecret,
    callbackURL: "http://127.0.0.1:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {

    console.log(accessToken);
    console.log(profile);

     var searchQuery = {
      name : profile.username
    };

    var updates = {
      name : profile.username,
      oauthID : profile.id
    };

    var options = {
      upsert: true,
    };

    User.findOneAndUpdate(searchQuery, updates, options, function(err, user){
        if(err){
          return done(err);
        } else {
          return done(null, user);
        }
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

module.exports = passport;
