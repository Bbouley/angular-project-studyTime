var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user.js');

var Tutorial = new Schema({
  // created_by: {type : Schema.Types.ObjectId, ref: 'users'},
  link: String,
  tags : [String],
  rating : Number,
  review : String,
});

module.exports = mongoose.model('tutorials', Tutorial);
