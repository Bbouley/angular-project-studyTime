var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose-q')(require('mongoose'));
var User = require('../models/user');
var Tutorial = require('../models/tutorials');
var Note = require('../models/notes');


//get all users
router.get('/', function(req, res, next){
  User.findQ({})
  .then(function(data){
    res.json(data);
  })
  .catch(function(err){
    res.send(err);
  });
});


//get single user information
router.get('/:id', function(req, res, next){
  User.findById(req.params.id)
  .then(function(result){
    res.json(result);
  })
  .catch(function(err){
    res.send(err);
  })
  .done();

});

//get all tutorials from a single user
router.get('/:userid/tutorials', function(req, res, next){
 User.findById(req.params.userid)
  .populate('tutorials')
  .exec(function(err, user){
    if(err){
      console.log(err);
    }
    else{
      res.json(user.tutorials);
    }
  });
});


//get all notes from a single user
router.get('/:userid/notes', function(req, res, next){
  User.findById(req.params.userid)
  .populate('notes')
  .exec(function(err, user){
    if(err){
      res.send(err);
    } else {
      res.json(user.notes);
    }
  });
});


//get all notes and tutorials for a single user
router.get('/:userid/all', function(req, res, next){
  User.findById(req.params.userid)
  .populate('notes')
  .populate('tutorials')
  .exec(function(err, user){
    if(err){
      res.send(err);
    } else {
      res.json(user);
    }
  });
});


//post single note to a user
router.post('/:userid/notes', function(req, res, next){
  var newNote = new Note(req.body);
  newNote.save();

  var id = req.params.userid;
  var update = {$push : {notes : newNote}};
  var options = {new : true};

  User.findByIdAndUpdateQ(id, update, options)
  .then(function(result){
    res.json(result);
  })
  .catch(function(err){
    res.send(err);
  });

});

//post to add single tutorial to a user
router.post('/:userid/tutorials', function(req, res, next){
  var newTutorial = new Tutorial(req.body);
  newTutorial.save();

  var id = req.params.userid;
  var update = {$push : { tutorials : newTutorial } };
  var options = {new :true };
  User.findByIdAndUpdateQ(id, update, options)
  .then(function(result){
    res.json(result);
  })
  .catch(function(err){
    res.send({'ERROR' : err});
  })
  .done();
});



module.exports = router;
