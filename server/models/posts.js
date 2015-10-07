var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Post = new Schema({
  title : String,
  date : Date,
  tags : [String],
});

module.exports = mongoose.model('posts', Post);
