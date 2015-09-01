var appConfig = require('./config/app_config');

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var logger = require('morgan');

var app = express();

mongoose.connect(appConfig.db);
var db = mongoose.connection;

db.once("open",function () {
  console.log("DB connected");
});
db.on('error',function (err) {
  console.log(err);
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(allowCrossDomain);

var router = require('./routes/index');
var usersRouter = require('./routes/users');
app.use('/', router);
app.use('/users', usersRouter);

app.listen(appConfig.port,function () {
  console.log("http://127.0.0.1:"+appConfig.port+"/");
});

function allowCrossDomain(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
    res.header('Access-Control-Allow-Methods', 'PATCH,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}
