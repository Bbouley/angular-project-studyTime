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

    console.log('hitting - github - access token: ' + accessToken);
    console.log('Github - user- profile: ' + profile);
    var stringifiedProfile = JSON.stringify(profile);
    var parsedProfile = JSON.parse(stringifiedProfile);
    console.log(parsedProfile);

     var searchQuery = {
      name : parsedProfile.username
    };

    var updates = {
      name : parsedProfile.username,
      oauthID : parsedProfile.id,
      resources : [],
      posts : []
    };

    var options = {
      upsert: true,
    };

    User.findOneAndUpdate(searchQuery, updates, options, function(err, user){
        if(err){
          return done(err);
        } else {
          console.log(user);
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
