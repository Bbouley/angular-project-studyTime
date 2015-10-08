var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose-q')(require('mongoose'));
var User = require('../models/user');
var Tutorial = require('../models/tutorials');
var Post = require('../models/posts');

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


//get single user information, populate with tutorials
router.get('/:id', function(req, res, next){
  User.findById(req.params.id)
  .then(function(result){
    res.json(result);
  })
  .catch(function(err){
    res.send(err);
  })
  .done();

  // User.findOneQ({oauthID : req.params.id})
  // .populate('tutorials')
  // .execQ()
  // .then(function(result){
  //   console.log(result);
  //   res.json(result);
  // })
  // .catch(function(err){
  //   console.log(err);
  //   res.send(err);
  // });


  // .then(function(result){
  //   result.populate('')
  // })
  // .catch(function(err){
  //   res.send(err);
  // });
});

//get all tutorials from that user
router.get('/:id/tutorials', function(req, res, next){
 User.findById(req.params.id)
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


//post single posts
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


//edit single posts


//delete single posts



module.exports = router;
