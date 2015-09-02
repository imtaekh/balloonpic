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
    console.log("PROFILE : ", profile);
    User.findOne({ instagramId: profile.id }, function (err, user) {
      if(user)
        return done(err, user);

      User.create({ instagramId: profile.id, username:profile.username }, function (err, user) {
        return done(err, user);
      });
    });
  }
));

module.exports=passport;
