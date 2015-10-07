process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose-q')(require('mongoose'));
var server = require('../server/app');
var User = require('../server/models/user');
var Post = require('../server/models/posts');
var Tutorial = require('../server/models/tutorials');

var should = chai.should();

chai.use(chaiHttp);


describe('Add Users', function(){

});


describe('Add Tutorials', function(){

  beforeEach(function(done){
    Tutorial.collection.drop();
    var newTutorial = new Tutorial({
      link : 'https://www.google.com',
      tags : ['javascript', 'java', 'ruby'],
      rating : 7,
      review : 'This is a good place to learn stuff'
    });
    newTutorial.saveQ()
    .then(function(result){
      res.json(result);
    })
    .catch(function(err){
      res.send(err);
    });
    done();
  });

  afterEach(function(done){
    Tutorial.collection.drop();
    done();
  });

  it('should list all tutorials on /tutorials get', function(done){
    chai.request(server)
    .get('/api/usertutorials/tutorials')
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
      .get('/api/usertutorials/tutorial/' + result.id)
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

  it('should add a single tutorial on /tutorials', function(done){
    chai.request(server)
    .post('/api/usertutorials/tutorials')
    .send({
      'link' : 'http://www.linkedin.com',
      'tags' : ['go', 'ruby'],
      'rating' : 4,
      'review': 'I review stuff'
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
  });

  it('should allow a tutorial to be edited on /tutorial/:id put request', function(done){
    chai.request(server)
    .get('/api/usertutorials/tutorials')
    .end(function(error, response){
      chai.request(server)
      .put('/api/usertutorials/tutorial/' +response.body[0]._id)
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
    .get('/api/usertutorials/tutorials')
    .end(function(error, response){
      chai.request(server)
      .delete('/api/usertutorials/tutorial/' + response.body[0]._id)
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




describe('Add Posts', function(){

});

