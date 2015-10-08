var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose-q')(require('mongoose'));
var User = require('../models/user');
var Tutorial = require('../models/tutorials');
var Note = require('../models/notes');

//get all posts
router.get('/notes', function(req, res, next){
  Note.findQ()
  .then(function(result){
    res.json(result);
  })
  .catch(function(err){
    res.send(err);
  })
  .done();
});

// get single posts
router.get('/notes/:id', function(req, res, next){
  Note.findByIdQ(req.params.id)
  .then(function(result){
    res.json(result);
  })
  .catch(function(err){
    res.send(err);
  })
  .done();
});


//post single posts


//edit single posts


//delete single posts



module.exports = router;
