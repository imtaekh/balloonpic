var appConfig = require('./app_config');

var passport = require('passport');
var InstagramStrategy = require('passport-instagram').Strategy;
var User = require('../models/User');
passport.use(new InstagramStrategy({
    clientID: appConfig.INSTAGRAM_CLIENT_ID,
    clientSecret: appConfig.INSTAGRAM_CLIENT_SECRET,
    callbackURL: appConfig.instagramCallbackUrl
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ instagramId: profile.id }, function (err, user) {
      if(user){
        user.accessToken = accessToken;
        user.save(function (err,user) {
          return done(err, user);
        });
      } else {
        User.create({ instagramId: profile.id, username:profile.username,accessToken:accessToken }, function (err, user) {
          return done(err, user);
        });
      }
    });
  }
));

module.exports=passport;
