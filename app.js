var appConfig = require('./config/app_config');


var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var logger = require('morgan');
var passport = require('passport');
var passport = require('passport');
var session = require('express-session');
var InstagramStrategy = require('passport-instagram').Strategy;
//database setting

mongoose.connect(appConfig.db);

var db = mongoose.connection;

db.once("open",function () {
  console.log("DB connected");
});
db.on('error',function (err) {
  console.log(err);
});

//middlewares

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(allowCrossDomain);

app.use(session({ secret: appConfig.sessionSecret })); // session secret
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
var User = require('./models/User');
passport.use(new InstagramStrategy({
    clientID: appConfig.INSTAGRAM_CLIENT_ID,
    clientSecret: appConfig.INSTAGRAM_CLIENT_SECRET,
    callbackURL: "http://localhost:3001/auth/instagram/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ instagramId: profile.id }, function (err, user) {
      if(user)
        return done(err, user);

      User.create({ instagramId: profile.id, name:profile.displayName }, function (err, user) {
        return done(err, user);
      });
    });
  }
));
//routing setting

var router = require('./routes/index');
var usersRouter = require('./routes/users');
app.use('/', router);
app.use('/users', isLoggedIn, usersRouter);

//server start

app.listen(appConfig.port,function () {
  console.log("http://127.0.0.1:"+appConfig.port+"/");
});

// functions

function allowCrossDomain(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
    res.header('Access-Control-Allow-Methods', 'PATCH,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.json({success:false, message:"need to login"});
}
