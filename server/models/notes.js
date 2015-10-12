var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Note = new Schema({
  title : String,
  date : Date,
  tags : [String],
  content: String
});

module.exports = mongoose.model('notes', Note);
