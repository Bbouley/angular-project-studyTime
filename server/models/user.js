var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  name: {
    type: String,
    required: true,
    index: {unique : true}
    },
    oauthID : String
  }
);
