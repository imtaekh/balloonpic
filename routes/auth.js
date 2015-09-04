var appConfig = require('../config/app_config');

var express = require('express');
var passport= require('passport');
var jwt     = require('jsonwebtoken');
var router  = express.Router();

router.get('/instagram',
  passport.authenticate('instagram'));

router.get('/instagram/callback',
  passport.authenticate('instagram', { failureRedirect: '/' }),
  function(req, res) {
    var token = jwt.sign({
      id: req.user._id,
      instagramId:req.user.instagramId,
      username:req.user.username,
      accessToken:req.user.accessToken
    }, appConfig.secret,  {
      expiresInMinutes: 1440
    });

    res.redirect("/app/#/?token="+token);
res.end();
  });

module.exports = router;
