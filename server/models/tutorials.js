var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user.js');

var Tutorial = new Schema({
  link: String,
  tags : [String],
  rating : Number,
  review : String,
});

module.exports = mongoose.model('tutorials', Tutorial);
