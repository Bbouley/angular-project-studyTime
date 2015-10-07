var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose-q')(require('mongoose'));
var User = require('../models/user');
var Tutorial = require('../models/tutorials');
var Post = require('../models/posts');

//get all posts
router.get('/posts', function(req, res, next){
  res.json('testing get all posts');
});

//get single posts


//post single posts


//edit single posts


//delete single posts



module.exports = router;
