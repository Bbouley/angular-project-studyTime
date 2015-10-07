var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Post = new Schema({
  _user: String,
  title : String,
  date : Date,
  tags : [String],
});

module.exports = mongoose.model('posts', Post);
