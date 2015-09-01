var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var UserSchema = mongoose.Schema({

});

var User = mongoose.model("User",UserSchema);

module.exports = User;
