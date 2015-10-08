process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose-q')(require('mongoose'));
var server = require('../server/app');
var User = require('../server/models/user');
var Note = require('../server/models/notes');
var Tutorial = require('../server/models/tutorials');

var should = chai.should();

chai.use(chaiHttp);


describe('Add Users', function(){

    beforeEach(function(done){
      User.collection.drop();
      Tutorial.collection.drop();

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
        tutorials : []
      });

      testUser.save();

      var id = testUser._id;
      var push = {$push : {tutorials : testTutorial}};
      var options = {new:true};

      User.findByIdAndUpdate(id, push, options, function(err, result){
        if(err){

        } else {

        }
      });
      done();
    });



  afterEach(function(done){
    User.collection.drop();
    Tutorial.collection.drop();
    done();
  });


  it ('should list all users on /users/ get', function(done){
    var newUser = new User({
      name : 'Super Face',
      oauthID : '12345',
      tutorials : []
    });
    newUser.save();
    chai.request(server)
    .get('/users/')
    .end(function(err, res){
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');
      res.body.length.should.equal(2);
      res.body[0].should.have.property('name');
      res.body[0].should.have.property('oauthID');
      res.body[0].should.have.property('tutorials');
      res.body[0].tutorials.should.be.a('array');
      res.body[1].name.should.equal('Super Face');
      res.body[1].tutorials.length.should.equal(0);
      done();
    });
  });


  it('should list a single user on /user/:id get', function(done){
    var newUser = new User({
      name : 'Super Face',
      oauthID : '12345',
      tutorials : []
    });
    newUser.saveQ()
    .then(function(result){
      chai.request(server)
      .get('/users/' + result.id)
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.a('object');
        res.body.should.be.a('object');
        res.body.should.have.property('name');
        res.body.should.have.property('oauthID');
        res.body.should.have.property('tutorials');
        res.body.name.should.equal('Super Face');
        res.body.tutorials.should.be.a('array');
        res.body.tutorials.length.should.equal(0);
        done();
      });
    });
  });


  it('should list a single users tutorials on /user/:id/tutorials get', function(done){

    var newTutorial = new Tutorial({
      link : 'www.github.com',
      tags : ['things' , 'stuff'],
      rating : 3,
      review : 'THIS IS PLACES'
    });

    newTutorial.save();

    chai.request(server)
    .get('/users/')
    .end(function(error, response){

        var id = response.body[0]._id;
        var push = {$push : {tutorials : newTutorial}};
        var options = {new:true};

      User.findByIdAndUpdateQ(id, push, options)
      .then(function(result){

      })
      .catch(function(err){

      });

      chai.request(server)
      .get('/users/' + response.body[0]._id + '/tutorials')
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body[0].should.have.property('link');
        res.body[0].should.have.property('tags');
        res.body[0].should.have.property('rating');
        res.body[0].should.have.property('review');
        res.body[0].tags.should.be.a('array');
        res.body[0].link.should.equal('testlink');
        res.body[1].link.should.equal('www.github.com');
        res.body[1].should.be.a('object');
        done();
      });
    });
  });


  it('should add a new tutorial to that user', function(done){
    chai.request(server)
    .get('/users/')
    .end(function(error, response){
      // console.log(response.body[0]);
      var user = response.body[0];

      var newTutorial = new Tutorial({
        link : 'www.github.com',
        tags : ['things' , 'stuff'],
        rating : 3,
        review : 'THIS IS PLACES'
      });

      newTutorial.save();

      chai.request(server)
      .post('/users/' + user._id + '/tutorials')
      .send(newTutorial)
      .end(function(err, res){
        // console.log(res.body);
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('name');
        res.body.should.have.property('_id');
        res.body.should.have.property('oauthID');
        res.body.should.have.property('posts');
        res.body.name.should.equal('Bradley');
        res.body.tutorials.should.be.a('array');
        // res.body.tutorials.length.should.equal(2);
        done();
      });

    });
  });

  it('should edit a tutorial and on getting the users tutorials will then show the edited version', function(done){
    chai.request(server)
    .get('/usertutorials/tutorials')
    .end(function(error, response){
      chai.request(server)
      .put('/usertutorials/tutorial/' + response.body[0]._id)
      .send({'link' : 'testing user linked up'})
      .end(function(error2, response2){
        chai.request(server)
        .get('/users/')
        .end(function(error3, response3){
          chai.request(server)
          .get('/users/' + response3.body[0]._id + '/tutorials')
          .end(function(err, res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            res.body[0].should.be.a('object');
            res.body[0].should.have.property('_id');
            res.body[0].should.have.property('link');
            res.body[0].should.have.property('rating');
            res.body[0].should.have.property('review');
            res.body[0].should.have.property('tags');
            res.body[0].tags.should.be.a('array');
            res.body[0].tags.length.should.equal(2);
            done();
          });
        });
      });
    });
  });


  it('should delete a tutorial from the user once the tutorial has been deleted form tutorial collection', function(done){
    chai.request(server)
    .get('/usertutorials/tutorials')
    .end(function(error, response){
      chai.request(server)
      .delete('/usertutorials/tutorial/' + response.body[0]._id)
      .end(function(error2, response2){
        chai.request(server)
        .get('/users/')
        .end(function(error3, response3){
          chai.request(server)
          .get('/users/' + response3.body[0]._id + '/tutorials')
          .end(function(err, res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            res.body.length.should.equal(0);
            done();
        });
      });
    });
  });
});

});





describe('Add Tutorials', function(){

  beforeEach(function(done){


    Tutorial.collection.drop();
    User.collection.drop();

    var newUser = new User({
      name: 'test user',
      oauthID : 'blah',
      tutorials : [],
      posts : [],
     });
    newUser.saveQ()
    .then(function(result){
      // console.log('user saved');
    })
    .catch(function(result){
      res.send(err);
    })
    .done();

    var newTutorial = new Tutorial({
      link : 'https://www.google.com',
      tags : ['javascript', 'java', 'ruby'],
      rating : 7,
      review : 'This is a good place to learn stuff'
    });
    newTutorial.saveQ()
    .then(function(result){
      // console.log('tutorial saved');
    })
    .catch(function(err){
      res.send(err);
    })
    .done();

    done();
  });


  afterEach(function(done){
    User.collection.drop();
    Tutorial.collection.drop();
    done();
  });

  it('should list all tutorials on /tutorials get', function(done){
    chai.request(server)
    .get('/usertutorials/tutorials')
    .end(function(err, res){
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');
      res.body[0].should.have.property('link');
      res.body[0].should.have.property('tags');
      res.body[0].should.have.property('rating');
      res.body[0].should.have.property('review');
      res.body[0].should.have.property('_id');
      res.body[0].link.should.equal('https://www.google.com');
      res.body[0].rating.should.equal(7);
      done();
    });
  });


  it('should list a single tutorial on /tutorial/:id get', function(done){

    var newTutorial = new Tutorial({
      link : 'https://www.github.com',
      tags : ['git', 'python'],
      rating : 10,
      review : 'Github 4 lyfe. And stuff'
    });

    newTutorial.saveQ()
    .then(function(result){
      chai.request(server)
      .get('/usertutorials/tutorial/' + result.id)
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('link');
        res.body.should.have.property('tags');
        res.body.should.have.property('rating');
        res.body.should.have.property('review');
        res.body.tags.should.be.a('array');
        res.body.tags.should.deep.equal(['git', 'python']);
        res.body.rating.should.equal(10);
        done();
      });
    })
    .done();
  });

/*  it('should add a single tutorial on /tutorials', function(done){
    chai.request(server)

    .post('/usertutorials/tutorials')
    .send({tutorial : {
      'link' : 'http://www.linkedin.com',
      'tags' : ['go', 'ruby'],
      'rating' : 4,
      'review': 'I review stuff'
    },
      user : {
        oauthID : 'blah',
      }
    })
    .end(function(err, res){
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('link');
      res.body.should.have.property('tags');
      res.body.should.have.property('rating');
      res.body.should.have.property('review');
      res.body.tags.should.be.a('array');
      res.body.rating.should.equal(4);
      res.body.link.should.equal('http://www.linkedin.com');
      done();
    });
  });*/

  it('should allow a tutorial to be edited on /tutorial/:id put request', function(done){
    chai.request(server)
    .get('/usertutorials/tutorials')
    .end(function(error, response){
      chai.request(server)
      .put('/usertutorials/tutorial/' +response.body[0]._id)
      .send({'link' : 'http://NewLink.com'})
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.should.be.a('object');
        res.body.should.have.property('link');
        res.body.should.have.property('tags');
        res.body.should.have.property('rating');
        res.body.should.have.property('review');
        res.body.link.should.equal('http://NewLink.com');
        res.body.review.should.equal('This is a good place to learn stuff');
        done();
      });
    });
  });


  it('should delete a tutorial on /tutorial/:id delete request', function(done){
    chai.request(server)
    .get('/usertutorials/tutorials')
    .end(function(error, response){
      chai.request(server)
      .delete('/usertutorials/tutorial/' + response.body[0]._id)
      .end(function(err, res){
        res.should.be.json;
        res.should.have.status(200);
        res.body.DELETED.should.have.property('link');
        res.body.DELETED.should.have.property('tags');
        res.body.DELETED.should.have.property('rating');
        res.body.DELETED.should.have.property('review');
        res.body.DELETED.link.should.equal('https://www.google.com');
        res.body.DELETED.tags.should.deep.equal(['javascript', 'java', 'ruby']);
        done();
      });
    });
  });

});




describe('Add Notes', function(){

  beforeEach(function(done){
    Note.collection.drop();
    User.collection.drop();

      var newUser = new User({
        name: 'test user',
        oauthID : 'blah',
        tutorials : [],
        posts : [],
       });
      newUser.saveQ()
      .then(function(result){
        // console.log('user saved');
      })
      .catch(function(result){
        res.send(err);
      })
      .done();

      var newNote = new Note({
       title: 'New Note 1',
       date : Date.now(),
       tags : ['test 1', 'test 1'],
      });
      newNote.saveQ()
      .then(function(result){
        console.log('note saved');
      })
      .catch(function(err){
        res.send(err);
      })
      .done();

      done();
    });


    afterEach(function(done){
      User.collection.drop();
      Tutorial.collection.drop();
      done();
    });


  it('should list all notes on /notes', function(done){
    chai.request(server)
    .get('/usernotes/notes')
    .end(function(err, res){
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');
      res.body[0].should.be.a('object');
      res.body[0].should.have.property ('title');
      res.body[0].should.have.property ('date');
      res.body[0].should.have.property ('tags');
      res.body[0].title.should.equal('New Note 1');
      res.body[0].tags.should.be.a('array');
      res.body[0].tags.length.should.equal(2);
      done();
    });
  });


  it('should list a single note on /notes/:id', function(done){
    chai.request(server)
    .get('/usernotes/notes')
    .end(function(error, response){
      chai.request(server)
      .get('/usernotes/note/' + response.body[0]._id)
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('title');
        res.body.should.have.property('date');
        res.body.should.have.property('tags');
        res.body.tags.should.be.a('array');
        res.body.tags.length.should.equal(2);
        res.body.title.should.equal('New Note 1');
        done();
      });
    });
  });


  // it('should post a single note on /notes', function(done){

  // });


  it('should edit a single note on /notes/:id', function(done){
    chai.request(server)
    .get('/usernotes/notes')
    .end(function(error, response){
      chai.request(server)
      .put('/usernotes/note/' + response.body[0]._id)
      .send({title : 'Testing Put Route'})
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('title');
        res.body.should.have.property('date');
        res.body.should.have.property('tags');
        res.body.title.should.equal('Testing Put Route');
        res.body.tags.should.be.a('array');
        res.body.tags.length.should.equal(2);
        done();
      });
    });
  });


  it('should delete a single note on /notes/:id', function(done){
    chai.request(server)
    .get('/usernotes/notes')
    .end(function(error, response){
      chai.request(server)
      .delete('/usernotes/note/' + response.body[0]._id)
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('_id');
        res.body.should.have.property('title');
        res.body.should.have.property('date');
        res.body.should.have.property('tags');
        res.body.tags.should.be.a('array');
        res.body.tags.length.should.equal(2);
        done();
      });
    });
  });


});

