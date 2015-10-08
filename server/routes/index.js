var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose-q')(require('mongoose'));
var User = require('../models/user');
var Tutorial = require('../models/tutorials');
var Note = require('../models/notes');
var passport = require('passport');
var github = require('../auth/github');

router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../../client/views', 'index.html'));
});

router.get('/resources', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../../client/views', 'resources.html'));
});

router.get('/login', function(req, res, next){
  res.sendFile(path.join(__dirname, '../../client/views', 'login.html'));
});

///authentication

router.get('/auth/github',
  github.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/auth/github/callback',
  github.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/user');
  });

function ensureAuthenticated(req, res, next){
  console.log(req.body);
  if(req.isAuthenticated()){
    return next();
  } else {
    res.json('You are not authenticated');
  }
}

router.get('/user', ensureAuthenticated, function(req, res, next) {
  res.sendFile(path.join(__dirname, '../../client/views', 'user.html'));
});




module.exports = router;
