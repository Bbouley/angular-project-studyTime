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

//get single tutorial from a single user
router.get('/:userid/tutorial/:tutorialid', function(req, res, next){
  User.findById(req.params.userid)
  .populate('tutorials')
  .exec(function(err, user){
    if(err){
      console.log(err);
    } else {
      Tutorial.findByIdQ(req.params.tutorialid)
      .then(function(result){
        res.json(result);
      })
      .catch(function(err){
        res.send(err);
      });
    }
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


//testing out schema in a post route
router.post('/', function(req, res, next){

  var testTutorial = new Tutorial({
    link: 'testlink',
    tags : ['test', 'test'],
    rating : 9,
    review: 'this is the review'
  });

  testTutorial.save();

  var testUser = new User ({
    name: 'Bradley',
    oauthID : '67890',
    tutorials : [testTutorial]
  });

  testUser.save(function(err){
    if(!err){
      User.find({})
      .populate('tutorials')
      .exec(function(error, user){
        if(!error){
          res.send(user);
        }
      });
    }
  });

});



module.exports = router;
