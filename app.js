var appConfig = require('./config/app_config');

var express   = require('express');
var app       = express();
var mongoose  = require('mongoose');
var bodyParser= require('body-parser');
var logger    = require('morgan');
var passport  = require('passport');
var session   = require('express-session');

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

//passport middlewares

app.use(session({ secret: appConfig.sessionSecret })); // session secret
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport');
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

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
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.json({success:false, message:"need to login"});
}
