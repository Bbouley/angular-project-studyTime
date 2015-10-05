var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose');
var User = require('../models/user');
var passport = require('passport');
var github = require('../auth/github');

router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../../client/views', 'index.html'));
});

router.get('/user', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../../client/views', 'user.html'));
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
  github.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });




module.exports = router;
