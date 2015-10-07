var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Post = require('./posts.js');
var Tutorial = require('./tutorials.js');

var User = new Schema({
  name: {
    type: String,
    required: true,
    index: {unique : true}
    },
    oauthID : String,
    resources : [Tutorial],
    posts : [Post]
  }
);

module.exports = mongoose.model('users', User);
