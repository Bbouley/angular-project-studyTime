var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Resource = new Schema({
  link: String,
  tags : [String],
  rating : Number,
  review : String,
});

var Post = new Schema({
  title : String,
  date : Date,
  tags : [String],
});

var User = new Schema({
  name: {
    type: String,
    required: true,
    index: {unique : true}
    },
    oauthID : String,
    resources : [Resource],
    posts : [Post]
  }
);

module.exports = mongoose.model('users', User);
