var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var UserSchema = mongoose.Schema({
  instagramId:String,
  name:String
});

var User = mongoose.model("User",UserSchema);

module.exports = User;
