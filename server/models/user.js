var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Tutorial = require('./tutorials.js');
var Note = require('./notes.js');

var User = new Schema({
  name: {
    type: String,
    required: true,
    index: {unique : true}
    },
    oauthID : String,
    tutorials : [{ type : Schema.Types.ObjectId, ref : 'tutorials'}],
    notes : [{ type : Schema.Types.ObjectId, ref : 'notes'}]
  }
);

module.exports = mongoose.model('users', User);
