var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose-q')(require('mongoose'));
var User = require('../models/user');
var Tutorial = require('../models/tutorials');
var Post = require('../models/posts');

//get all tutorials
router.get('/tutorials', function(req, res, next){
  Tutorial.findQ()
  .then(function(data){
    res.json(data);
  })
  .catch(function(err){
    res.json({'ERROR' : err});
  })
  .done();
});

//get single tutorial
router.get('/tutorial/:id', function(req, res, next){
  Tutorial.findByIdQ(req.params.id)
  .then(function(result){
    res.json(result);
  })
  .catch(function(err){
    res.send({'ERROR' : err});
  })
  .done();
});

//post single tutorial
router.post('/tutorials', function(req, res, next){
  newTutorial = new Tutorial(req.body);
  newTutorial.saveQ()
  .then(function(result){
    res.json(result);
  })
  .catch(function(err){
    res.send({'ERROR' : err});
  })
  .done();
});

//edit single tutorial
router.put('/tutorial/:id', function(req, res, next){
  var update = req.body;
  var options = {new: true};
  Tutorial.findByIdAndUpdateQ(req.params.id, update, options)
  .then(function(result){
    res.json(result);
  })
  .catch(function(err){
    res.send({'ERROR' : err });
  })
  .done();
});

//delete single tutorial
router.delete('/tutorial/:id', function(req, res, next){
  Tutorial.findByIdAndRemoveQ(req.params.id)
  .then(function(result){
    res.json({'DELETED' : result});
  })
  .catch(function(err){
    res.send({'ERROR' : err});
  });
});


module.exports = router;
