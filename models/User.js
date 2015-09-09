var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
  instagramId:String,
  username:String,
  accessToken:String
});

var User = mongoose.model("User",UserSchema);

module.exports = User;
