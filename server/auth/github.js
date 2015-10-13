require('dotenv').load();
var passport = require('passport');
var GitHubStrategy = require('passport-github2');
var User = require('../models/user');

passport.use(new GitHubStrategy({
    clientID: process.env.githubClientID,
    clientSecret: process.env.githubClientSecret,
    callbackURL: "http://studyupcoding.herokuapp.com/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {

    var stringifiedProfile = JSON.stringify(profile);
    var parsedProfile = JSON.parse(stringifiedProfile);

     var searchQuery = {
      name : parsedProfile.username
    };

    var updates = {
      name : parsedProfile.username,
      oauthID : accessToken,
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
